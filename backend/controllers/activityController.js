import { prisma } from "../db/prisma/prisma.js";
import { getTrainerNotecountForPerson } from "./notesController.js";
import { getEventsByCriteria, getEventsCountByCriteria, getLikedEvents } from "./eventController.js";
// Activity rules

// Ammt of lessons / notes per week (8/w ideal)
// Last login
// Last interaction

// Simple in-memory cache with TTL (Time To Live)
const configCache = {
  values: {},
  lastFetch: 0,
  ttl: 5 * 60 * 1000 // 5 minutes
};

async function getCachedConfig(key, fallback) {
  const now = Date.now();
  if (!configCache.values[key] || now - configCache.lastFetch > configCache.ttl) {
    const config = await prisma.activity_config.findUnique({ where: { key } });
    if (config) {
      configCache.values[key] = parseConfigValue(config.value);
    } else {
      configCache.values[key] = fallback;
    }
    configCache.lastFetch = now;
  }
  return configCache.values[key];
}

function parseConfigValue(val) {
  try {
    return JSON.parse(val);
  } catch {
    return isNaN(val) ? val : Number(val);
  }
}

// Get by ID
export const getActivity = async (req,res) => {
    const { id } = req.params;
    try {
      const retval = await recalculateActivity(id);
      res.status(200).json({ message: "Status Ok" }); //return it
    } catch (error) {
      console.error("Error in getActivity:", error);
      res.status(404).json({ message: error.message });
    }
}

async function refreshActivityForUser(user_id) {
  const postWindow = await getCachedConfig("postActivenessWindow", 7);
  const noteWindow = 7;

  //console.log("PREPARING le refresh",user_id)

  let Likes = await getLikedEvents(user_id, postWindow);
  const realNotes = await getTrainerNotecountForPerson(user_id, noteWindow);
  const realLikes = Likes.length;      

  console.log("Refresh resulst", realNotes, realLikes)

  await prisma.user_activity_score.upsert({
    where: { user_id },
    update: {
      post_interactions_monthly: realLikes,
      notes_received_weekly: realNotes,
    },
    create: {
      user_id,
      post_interactions_monthly: realLikes,
      notes_received_weekly: realNotes,
    }})
}

// Try to always call this, triggers should update the other variables
export async function recalculateActivity(uid, refreshDB = false) {
  // Step 1: Get precomputed metrics
  // console.log("Recalculating for",uid)

  const weeklyTrainingTarget = await getCachedConfig("weeklyTrainingTarget", 8)
  const postWindow = await getCachedConfig("postActivenessWindow", 7);
  const weights = await getCachedConfig("scoreWeights", [5,3,2])

  const criteria = {
    where: {
      posted_at: {
        gte: new Date(Date.now() - postWindow * 86400000)
      }
    }
  };


  const postsInTimeWindow = await getEventsCountByCriteria(criteria);

  if (refreshDB) {
    await refreshActivityForUser(uid)
  }

  const metrics = await prisma.user_activity_score.findUnique({
    where: { user_id: uid }
  });

  if (!metrics) {
    console.warn(`No metrics found for user ${uid}`);
    return;
  }

  // notes_received_weekly    Int       @default(0)
  // days_since_last_login    Int       @default(0)
  // post_interactions_monthly Int      @default(0)

  const training_activeness = Math.min(metrics.notes_received_weekly / weeklyTrainingTarget, 1.0) * weights[0]
  const login_activeness = Math.exp(-metrics.days_since_last_login / 7) * weights[1]
  
  const likeRatio = metrics.post_interactions_monthly / postsInTimeWindow
  const like_activeness = Math.min(likeRatio, 1.0) * weights[2] || 0

  // Step 2: Calculate score using weights
  console.log("SCORES ",training_activeness, login_activeness, like_activeness)
  var score = training_activeness + login_activeness + like_activeness
  // Rounding
  // score = Math.round(score * 10) / 10

  console.log("New score for ", uid, " is ", score)

  // Step 3: Upsert activity score
  await prisma.user_activity_score.upsert({
    where: { user_id: parseInt(uid) },
    update: { activity_score: score },
    create: { user_id: uid, activity_score: score },
  });

  return score
}

export async function initDefaultJudgeValues() {
  await prisma.activity_config.createMany({
    data: [
      { key: "weeklyTrainingTarget", value: "8" },
      { key: "postActivenessWindow", value: "7" },
      { key: "scoreWeights", value: "[5,3,2]" },
    ],
    skipDuplicates: true
  });
}

export async function auditAndFixUserMetrics({ autoFix = false } = {}) {
  const postWindow = await getCachedConfig("postActivenessWindow", 7);
  const noteWindow = 7;

  const allUsers = await prisma.users.findMany({ select: { id: true } });

  let mismatchCount = 0;

  for (const { id: user_id } of allUsers) {
    console.log("AUDITTING", user_id)
    const realNotes = (await getTrainerNotecountForPerson(user_id, noteWindow)).length;
    const realLikes = (await getLikedEvents(user_id, postWindow)).length;

    const stored = await prisma.user_activity_score.findUnique({ where: { user_id } });

    const needsUpdate =
      !stored ||
      stored.post_interactions_monthly !== realLikes ||
      stored.notes_received_weekly !== realNotes && !!realNotes

    if (needsUpdate) {
      mismatchCount++;
      console.warn(`[Audit] Mismatch for user ${user_id}: stored=${JSON.stringify(stored)}, actual={likes: ${realLikes}, notes: ${realNotes}}`);

      if (autoFix) {
        await prisma.user_activity_score.upsert({
          where: { user_id },
          update: {
            post_interactions_monthly: realLikes,
            notes_received_weekly: realNotes,
          },
          create: {
            user_id,
            post_interactions_monthly: realLikes,
            notes_received_weekly: realNotes,
          }
        });

        await recalculateActivity(user_id);

        console.log(`[Audit] Auto-fixed user ${user_id} and recalculated activity.`);
      }
    }
  }

  console.log(`[Audit] Done. Total mismatches: ${mismatchCount}${autoFix ? ' (fixed)' : ''}`);
}

// Method 2: Using $executeRaw (if you don't need the return value)
export async function updateUserLoginSimple(userId) {
  try {
    await prisma.$executeRaw`
      SELECT update_user_login(${userId});
    `;
    return true;
  } catch (error) {
    console.error('Failed to update user login:', error);
    return false;
  }
}


export const augmentWithActivity = async (req, res) => {
  try {
    var { members, pagination } = req.data;

    const enriched = await Promise.all(
      members.map(async member => {
        const activity_score = await recalculateActivity(member.id);
        member["activity_score"] = activity_score;
        return member;
      })
    );

    console.log(enriched)

    res.json({
      data: enriched,
      pagination: pagination
    });
  } catch (error) {
    console.error("Error fetching members + activity:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

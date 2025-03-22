<template>
  <div class="container">
    <!-- Header buat event -->
    <div class="Header">
      <h1>EVENT</h1>
    </div>

    <div class="search-bar">
      <input type="text" v-model="searchQuery" placeholder="Search..." />
      <button @click="searchPosts">Search</button>
    </div>

    <!-- Posts List -->
    <div class="posts">
      <button v-for="post in displayedPosts" :key="post.id" class="post" @click="goToPost(post.id)">
        <div class="post-header">
          <h3>{{ post.author }}</h3>
          <span>{{ post.timestamp }}</span>
        </div>
        <p>{{ post.content }}</p>
      </button>
      <div ref="loadMoreTrigger" class="load-more-trigger"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const newPostContent = ref('');
const searchQuery = ref('');
const posts = ref([]);
const displayedPosts = ref([]);
const postsPerPage = 20;
const currentPage = ref(1);
const router = useRouter();

// Generate 100 dummy posts
for (let i = 1; i <= 100; i++) {
  posts.value.push({
    id: i,
    author: `User${i}`,
    content: `This is a sample post number ${i}!`,
    timestamp: `${i}h`,
  });
}

const loadMorePosts = () => {
  const start = (currentPage.value - 1) * postsPerPage;
  const end = currentPage.value * postsPerPage;
  displayedPosts.value = posts.value.slice(0, end);
  currentPage.value++;
};

const filteredPosts = computed(() => {
  if (!searchQuery.value) {
    return posts.value;
  }
  return posts.value.filter(post =>
    post.content.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const searchPosts = () => {
  // This function is intentionally left blank as the filtering is handled reactively by the computed property
};

const goToPost = (id) => {
  router.push(`/eventDetails/${id}`);
};

onMounted(() => {
  loadMorePosts();

  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      loadMorePosts();
    }
  }, {
    root: null,
    rootMargin: '0px',
    threshold: 1.0
  });

  observer.observe(document.querySelector('.load-more-trigger'));
});
</script>

<style scoped>
.Header {
  background-color: white;
  padding: 20px;
  text-align: center;
  font-size: 30px;
}

.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
  background-color: var(--color-background);
}

.search-bar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.search-bar input {
  flex: 1;
  padding: 10px;
  border: 1px solid var(--color-border);
  border-radius: 10px;
  margin-right: 10px;
}

.search-bar button {
  background-color: var(--vt-c-primary-blue);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 10px;
  cursor: pointer;
}

.search-bar button:hover {
  background-color: var(--vt-c-primary-blue-hover);
}

.new-post {
  background-color: var(--color-background);
  padding: 10px;
  margin-top: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--vt-c-primary-blue);
}

.new-post textarea {
  width: 100%;
  border: none;
  padding: 10px;
  border-radius: 10px;
  resize: none;
  font-size: 16px;
  background-color: var(--color-background);
  color: var(--color-text);
}

.new-post button {
  background-color: var(--vt-c-primary-blue);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 10px;
  cursor: pointer;
  margin-top: 10px;
}

.new-post button:hover {
  background-color: var(--vt-c-primary-blue-hover);
}

.posts {
  margin-top: 20px;
}

.post {
  background-color: var(--color-background);
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--vt-c-primary-blue);
  animation: slideInRight 0.5s ease-out;
  cursor: pointer;
  text-align: left;
  width: 100%;
  border: none;
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.post-header h3 {
  margin: 0;
  color: var(--color-text);
}

.post-header span {
  color: gray;
  font-size: 12px;
}

.post p {
  color: var(--color-text);
}

.load-more-trigger {
  height: 1px;
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Media query for larger screens */
@media (min-width: 1024px) {
  .container {
    max-width: 800px;
  }

  .new-post textarea {
    font-size: 18px;
  }

  .new-post button {
    padding: 12px 24px;
  }

  .post {
    padding: 15px;
  }

  .post-header h3 {
    font-size: 18px;
  }

  .post-header span {
    font-size: 14px;
  }

  .post p {
    font-size: 16px;
  }
}
</style>
// Intended to be used for single member member list operation

import type { Member } from "./member";

export interface memberlistOp {
    member : Member
    operation : "add" | "remove"
}
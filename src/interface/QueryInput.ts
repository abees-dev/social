export interface QueryInput {
  limit?: number;
  position?: number;
}

export interface ReactionQueryInput extends QueryInput {
  type?: number;
}

export interface FeelingQueryInput extends QueryInput {
  search?: string;
  order?: string;
}

export type FriendQueryInput = QueryInput

export type MessageQueryInput = QueryInput

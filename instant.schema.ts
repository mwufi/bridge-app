// Docs: https://www.instantdb.com/docs/modeling-data

import { i } from "@instantdb/react-native";

const _schema = i.schema({
  // We inferred 5 attributes!
  // Take a look at this schema, and if everything looks good,
  // run `push schema` again to enforce the types.
  entities: {
    $files: i.entity({
      path: i.string().unique().indexed(),
      url: i.any(),
    }),
    $users: i.entity({
      email: i.string().unique().indexed(),
    }),
    bunnies: i.entity({
      data: i.string(),
      name: i.string(),
    }),
    conversations: i.entity({
      createdAt: i.date().indexed(),
      data: i.json(),
      name: i.string(),
    }),
    "dev.config": i.entity({
      name: i.string().unique().indexed(),
      value: i.json(),
    }),
    messages: i.entity({
      content: i.string(),
      createdAt: i.date(),
      role: i.string(),
    }),
    profiles: i.entity({
      details: i.json(),
      theme: i.string(),
      userDescription: i.string(),
      userHandle: i.string().unique().indexed(),
      userName: i.string().unique().indexed(),
    }),
  },
  links: {
    conversationsMessages: {
      forward: {
        on: "conversations",
        has: "many",
        label: "messages",
      },
      reverse: {
        on: "messages",
        has: "one",
        label: "conversations",
        onDelete: "cascade",
      },
    },
  },
  rooms: {},
});

// This helps Typescript display nicer intellisense
type _AppSchema = typeof _schema;
interface AppSchema extends _AppSchema {}
const schema: AppSchema = _schema;

export type { AppSchema };
export default schema;

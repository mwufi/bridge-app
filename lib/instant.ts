import { init, i, InstaQLEntity } from "@instantdb/react-native";
import schema from "@/instant.schema";

// ID for app: convos
const APP_ID = "508ec4a0-6487-40e5-81dc-61464a9dfc38";

const db = init({ appId: APP_ID, schema });

export default db;

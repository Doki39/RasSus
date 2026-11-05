import { setupDatabase } from "./setup";
import { pool } from "./pool";

setupDatabase()
  .then(() => {
    console.log("Baza je spremna.");
  })
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => pool.end());

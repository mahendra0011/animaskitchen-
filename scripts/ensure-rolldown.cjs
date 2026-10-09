const { execSync } = require("node:child_process");

if (process.platform === "linux" && process.arch === "x64") {
  try {
    require.resolve("@rolldown/binding-linux-x64-gnu");
    console.log("✓ @rolldown/binding-linux-x64-gnu is present");
  } catch {
    console.log("⚡ Missing @rolldown/binding-linux-x64-gnu on Linux x64. Installing...");
    try {
      execSync("npm install --no-save @rolldown/binding-linux-x64-gnu@1.2.1", {
        stdio: "inherit",
      });
      console.log("✓ Successfully installed @rolldown/binding-linux-x64-gnu");
    } catch (installErr) {
      console.error("Failed to install @rolldown/binding-linux-x64-gnu:", installErr);
    }
  }
}

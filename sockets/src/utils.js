import { writeFile, readFileSync } from "fs";

/**
 * Synchronize a variable to disk every n milliseconds.
 * @param {Object} variable - The variable to sync.
 * @param {string} filePath - Path to the file where the variable will be saved.
 * @param {number} intervalMs - Sync interval in milliseconds.
 * @returns {Function} A function to stop syncing.
 */
export function syncVariableToDisk(variable, filePath, intervalMs) {
  let isRunning = true;

  const intervalId = setInterval(async () => {
    if (!isRunning) return;
    await writeFile(filePath, JSON.stringify(variable, null, 2), (err) => {
      if (err) console.log(err);
    });
  }, intervalMs);

  return () => {
    isRunning = false;
    clearInterval(intervalId);
    console.log("Sync stopped.");
  };
}

/**
 * Reconstruct a variable from the file.
 * @param {string} filePath - Path to the file to read from.
 * @returns {Object} The reconstructed variable.
 */
export function reconstructVariable(filePath) {
  try {
    const data = readFileSync(filePath);
    return JSON.parse(data); // Parse JSON content to reconstruct the variable
  } catch (error) {
    if (error.code === "ENOENT") {
      console.warn("File not found, returning an empty object.");
      return {}; // Return an empty object if the file doesn't exist
    } else {
      throw error; // Rethrow other errors
    }
  }
}

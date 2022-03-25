import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { CreateBucketCommand } from "@aws-sdk/client-s3";
import path from "path";
import fs from "fs";
import { spawn, spawnSync } from "child_process";

const REGION = "us-east-1";
const s3Client = new S3Client({
  credentials: {
    accessKeyId: "test",
    secretAccessKey: "test",
  },
  region: REGION,
  endpoint: "http://localhost:5000",
});

const Bucket = "mothena";

export default async () => {
  try {
    await s3Client.send(
      new CreateBucketCommand({
        Bucket,
      })
    );
    const gameEventFiles = fs.readdirSync("./src/data/game-events");
    for (const [_, file] of gameEventFiles.entries()) {
      const fileStream = fs.createReadStream(`./src/data/game-events/${file}`);

      await s3Client.send(
        new PutObjectCommand({
          Bucket,
          Key: `/gameEvents/${path.basename(file)}`,
          Body: fileStream,
        })
      );
    }
    const hiveUpdateScriptPath = path.join("../", "python", "hive-update.py");
    const pythonSpawn = spawnSync("python3", [hiveUpdateScriptPath]);

    // console.log("pythonSpawn", pythonSpawn);

    // if (pythonSpawn.stderr) {
    //   throw new Error(pythonSpawn.stderr as any);
    // }
  } catch (error) {
    console.error(error);
  }
};

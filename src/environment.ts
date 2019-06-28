import * as dotenv from "dotenv"

dotenv.config()

export const env = async () => {
  return {
    FOO: process.env.FOO
  }
}

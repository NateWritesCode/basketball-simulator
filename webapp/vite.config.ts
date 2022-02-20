import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

function graphqlFile() {
  return {
    name: "graphql-file",
    transform(src, id) {
      if (id.endsWith(".graphql")) {
        const str = JSON.stringify(src);
        return {
          code:
            "import gql from 'graphql-tag';const doc=" +
            str +
            "; export default gql`${doc}`",
          map: null,
        };
      }
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [graphqlFile(), react()],
});

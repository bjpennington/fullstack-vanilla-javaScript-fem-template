import { DEFAULT_HEADERS } from "../util/util.js";
import { once } from "node:events";

const routes = ({ userFactory }) => ({
  "/users:get": async (request, response) => {
    const users = await userFactory.find();
    response.writeHead(200, DEFAULT_HEADERS);

    return response.end(JSON.stringify(users));
  },
  "/users:post": async (request, response) => {
    const dataBuffer = await once(request, "data");
    const data = JSON.parse(dataBuffer);

    // this would be the place we add data validation

    await userFactory.create(data);
    response.writeHead(201, DEFAULT_HEADERS);
    return response.end(
      JSON.stringify({ message: "User created successfully!", user: data }),
    );
  },
});

export { routes };

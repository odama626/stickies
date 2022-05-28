import { createPrismaWebClient } from "./main";

describe("prisma web client", () => {
  it("can proxy basic prisma types", () => {
    const request = jest.fn();
    const client = createPrismaWebClient({ baseUrl: "http://example.com", request });

    client.task.findMany({ where: { id: "" }, select: { title: true, content: true } });

    expect(request).toHaveBeenCalledWith({
      baseUrl: "http://example.com",
      action: "findMany",
      model: "task",
      body: {
        select: {
          content: true,
          title: true,
        },
        where: {
          id: "",
        },
      },
    });
  });
});

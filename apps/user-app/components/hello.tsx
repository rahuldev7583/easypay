import { trpc } from "../server/client";

const HelloComponent = () => {
  const { data } = trpc.hello.greet.useQuery();
  console.log(data);

  return <div>{data}</div>;
};

export default HelloComponent;

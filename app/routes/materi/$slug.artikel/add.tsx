import { Category, Article } from "@prisma/client";
import { Form, json, useActionData } from "remix";

import { db } from "~/utils/db.server";

type ActionData = {
  formError?: String;

  fieldErrors?: {
    title: string | undefined;
    content: string | undefined;
  };

  fields?: {
    title: string;
    content: string;
  };
};

const badRequest = (data: ActionData) => json(data, { status: 400 });

export default function AddArticleRoute() {
  const actionData = useActionData<ActionData>();

  <Form method="post"></Form>;

  return (
      <h1>test</h1>
  );
}

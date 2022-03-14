import { ActionFunction, Form, Link } from "remix";
import { useActionData, redirect, json } from "remix";
import type { Category } from "@prisma/client";

import { db } from "~/utils/db.server";

function validateCategoryTitle(title: string) {
  if (title.length < 3) {
    return `Judul kategori terlalu pendek`;
  }
}

function isDuplicateSlug(slug: Category | null) {
  if (slug) {
    return `Judul sudah ada di database`;
  }
}

function validateCategoryDesc(desc: string) {
  if (desc.length < 10) {
    return `Deskripsi kategori terlalu pendek`;
  }
}

type ActionData = {
  formError?: string;

  fieldErrors?: {
    title: string | undefined;
    desc: string | undefined;
  };

  fields?: {
    title: string;
    slug: string;
    desc: string;
  };
};

const badRequest = (data: ActionData) => json(data, { status: 400 });

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();

  const title = form.get("cat-title");
  const desc = form.get("cat-desc");

  if (typeof title !== "string" || typeof desc !== "string") {
    return badRequest({
      formError: `Form not submitted correctly`,
    });
  }

  const slug = title.split(" ").join("-").toLowerCase();
  const slugExist = await db.category.findFirst({
    where: {
      slug,
    },
  });

  const fieldErrors = {
    title: validateCategoryTitle(title) || isDuplicateSlug(slugExist),
    desc: validateCategoryDesc(desc),
  };

  const fields = { title, slug, desc };

  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({
      fieldErrors,
      fields,
    });
  }

  await db.category.create({
    data: fields,
  });

  return redirect("/materi");
};

export default function AddCategoryRoute() {
  const actionData = useActionData<ActionData>();

  return (
    <div>
      <h3>Add new category</h3>
      <Form method="post">
        <div>
          {actionData?.formError ? <p>{actionData.formError}</p> : null}
        </div>
        <div>
          <label>
            <span>Nama Kategori: </span>
            <input
              type="text"
              defaultValue={actionData?.fields?.title}
              name="cat-title"
            />
          </label>
          {actionData?.fieldErrors?.title ? (
            <p>{actionData.fieldErrors.title}</p>
          ) : null}
        </div>
        <div>
          <label>
            <span>Deskripsi Kategori: </span>
            <textarea defaultValue={actionData?.fields?.desc} name="cat-desc" />
          </label>
          {actionData?.fieldErrors?.desc ? (
            <p>{actionData.fieldErrors.desc}</p>
          ) : null}
        </div>
        <div>
          <button type="submit">Tambah</button>
        </div>
        <Link to="/materi"><button>Batal</button></Link>
      </Form>
    </div>
  );
}

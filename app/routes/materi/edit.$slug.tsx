import { Form, ActionFunction, LoaderFunction, useLoaderData } from "remix";
import { Link, useActionData, redirect, json } from "remix";
import type { Category } from "@prisma/client";
import { db } from "~/utils/db.server";

type LoaderData = {
  category: Category;
};

export const loader: LoaderFunction = async ({ params }) => {
  const category = await db.category.findUnique({
    where: { slug: params.slug },
  });

  if (!category) {
    throw json(
      { message: "Kategori tidak ditemukan :(" },
      {
        status: 404,
      }
    );
  }

  const data: LoaderData = {
    category: category,
  };

  return data;
};

function validateCategoryTitle(title: string | null) {
  if (title == null || title == "") {
    return `Judul tidak boleh kosong`;
  } else if (title.length < 3) {
    return `Judul kategori terlalu pendek`;
  }
}

function isDuplicateSlug(slug: Category | null) {
  if (slug) {
    return `Judul sudah ada di database`;
  }
}

function validateCategoryDesc(desc: string) {
  if (desc.length == 0) {
    return `Deskripsi tidak boleh kosong`;
  } else if (desc.length < 10) {
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
    desc: string;
  };
};

const badRequest = (data: ActionData) => json(data, { status: 400 });

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();

  const title = form.get("cat-title");
  const desc = form.get("cat-desc");
  const id = form.get("id");

  if (request.method == "DELETE") {
    await db.category.delete({
      where: {
        id: id?.toString(),
      },
    });

    return redirect("/materi");
  }

  const currentSlug = form.get("slug");

  if (typeof title !== "string" || typeof desc !== "string") {
    return badRequest({
      formError: `Form not submitted correctly`,
    });
  }

  const slug = title.split(" ").join("-").toLowerCase();
  const slugExist =
    slug === currentSlug
      ? null
      : await db.category.findFirst({
          where: {
            slug,
          },
        });

  const fields = { title, slug, desc };

  const fieldErrors = {
    title: validateCategoryTitle(title) || isDuplicateSlug(slugExist),
    desc: validateCategoryDesc(desc),
  };

  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({
      fieldErrors,
      fields,
    });
  }

  await db.category.update({
    where: {
      id: id?.toString(),
    },
    data: fields,
  });

  return redirect("/materi");
};

export default function EditCategoryRoute() {
  const data = useLoaderData<LoaderData>();
  const actionData = useActionData<ActionData>();

  return (
    <div>
      <h3>Edit category</h3>
      <Form method="post">
        <div>
          {actionData?.formError ? <p>{actionData.formError}</p> : null}
        </div>
        <div style={{ display: "none" }}>
          <input name="id" defaultValue={data.category.id} />
        </div>
        <div style={{ display: "none" }}>
          <input name="slug" defaultValue={data.category.slug} />
        </div>
        <div>
          <label>
            <span>Nama Kategori: </span>
            <input
              type="text"
              defaultValue={data.category.title}
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
            <textarea defaultValue={data.category.desc} name="cat-desc" />
          </label>
          {actionData?.fieldErrors?.desc ? (
            <p>{actionData.fieldErrors.desc}</p>
          ) : null}
        </div>
        <div>
          <button type="submit">Edit</button>
          <Link to="/materi">
            <button type="button">Batal</button>
          </Link>
        </div>
      </Form>
      <Form method="delete">
        <div style={{ display: "none" }}>
          <input name="id" defaultValue={data.category.id} />
        </div>
        <div>
          <button type="submit">Hapus</button>
        </div>
      </Form>
    </div>
  );
}

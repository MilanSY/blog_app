import { revalidatePath } from "next/cache";

export function revalidateAboutContent() {
  revalidatePath("/about");
}

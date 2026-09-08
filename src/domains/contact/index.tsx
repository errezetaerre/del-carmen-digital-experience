import ContactExperience from "./sections/contact/ContactExperience";
import Footer from "@/shared/layout/footer";

export default function Contact() {
  return (
    <main className="relative w-full min-w-0 overflow-x-clip bg-neutral-950 text-stone-100" >
      <ContactExperience />
      < Footer />
    </main>
  );
}
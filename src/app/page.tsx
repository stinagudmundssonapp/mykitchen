import Fridge from "@/components/Fridge";
import PageHeader from "@/components/PageHeader";
import HomeActions from "@/components/HomeActions";

export default function Home() {
  return (
    <div className="px-5 lg:px-12 py-6 lg:py-12 max-w-5xl mx-auto">
      <PageHeader
        eyebrow="Hjem"
        title="Hva har du i dag?"
        description="Åpne kjøleskapet for å se hva du har — eller scan en kvittering for å fylle det opp på sekunder."
      />

      <div className="mt-8 lg:mt-12 grid lg:grid-cols-[1fr_320px] gap-10 lg:gap-16 items-start">
        <div className="order-2 lg:order-1">
          <Fridge />
        </div>
        <div className="order-1 lg:order-2 lg:sticky lg:top-6">
          <HomeActions />
        </div>
      </div>
    </div>
  );
}

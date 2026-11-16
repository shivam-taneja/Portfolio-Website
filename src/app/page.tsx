import AboutMeSection from "@/components/home/about-me";
import ExperienceSection from "@/components/home/experience";
import OpenSourceContributionSection from "@/components/home/open-source-contribution";
import MentorshipSection from "@/components/home/mentorship";
import CertificationsSection from "@/components/home/certifications";
import SideProjectsSection from "@/components/home/side-projects";
import WritingSection from "@/components/home/writing";
import Wrapper from "@/components/wrapper";

export default function Home() {
  return (
    <Wrapper>
      <AboutMeSection />
      <ExperienceSection />
      <SideProjectsSection />
      <WritingSection />
      <MentorshipSection />
      <CertificationsSection />
      <OpenSourceContributionSection />
    </Wrapper>
  );
}

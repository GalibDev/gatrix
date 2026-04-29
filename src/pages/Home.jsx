import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import About from "../components/About";
import Team from "../components/Team";
import Projects from "../components/Projects";
import Gallery from "../components/Gallery";
import Achievements from "../components/Achievements";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import Loader from "../components/Loader";
import BirthdayPopup from "../components/BirthdayPopup";
import logo from "../assets/logo.png";
import { supabase } from "../lib/supabase";


import NoticeBar from "../components/NoticeBar";
import member1 from "../assets/member1.jpeg";
import member2 from "../assets/member2.jpeg";
import member3 from "../assets/member3.jpeg";
import member4 from "../assets/member4.jpeg";
import member5 from "../assets/member5.jpeg";
import member6 from "../assets/member6.jpeg";

import group1 from "../assets/group1.jpeg";
import group2 from "../assets/group2.jpeg";
import group3 from "../assets/group3.jpeg";

import gallery1 from "../assets/gallery1.jpg";
import gallery2 from "../assets/gallery2.jpg";
import gallery3 from "../assets/gallery3.jpg";
import gallery4 from "../assets/gallery4.jpg";
import gallery5 from "../assets/gallery5.jpg";
import gallery6 from "../assets/gallery6.jpg";
import AIAssistant from "../components/AIAssistant";







const heroImages = [group1, group2, group3];

const content = {
  en: {
    nav: {
      home: "Home",
      about: "About",
      team: "Team",
      projects: "Projects",
      gallery: "Gallery",
      achievements: "Achievements",
      contact: "Contact",
    },
    hero: {
      title: "Welcome to GATRIX",
      subtitle: "We build robotics and innovative solutions for the future.",
      btn: "Explore Projects",
      badge: "Robotics • Innovation • Future",
      typing: [
        "We build robots...",
        "We create automation...",
        "We innovate technology...",
      ],
    },
    about: {
      title: "About GATRIX",
      desc: "GATRIX is a robotics group where we create innovative projects using technology, automation, and teamwork.",
    },
    team: {
      title: "Our Team",
      role: "Role",
      skills: "Skills",
      contact: "Contact",
      close: "Close",
      viewProfile: "View Profile",
    },
    projects: {
      title: "Projects",
      all: "All",
      robotics: "Robotics",
      iot: "IoT",
      automation: "Automation",
      close: "Close",
      details:
        "This project is part of the GATRIX robotics portfolio. You can add full description, used technology, images, and demo links here.",
      search: "Search projects...",
      viewDetails: "View Details",
      noResults: "No projects found.",
      techTitle: "Technologies",
      teamTitle: "Team Members",
    },
    gallery: { title: "Gallery" },
    achievements: { title: "Achievements & Events" },
    contact: {
      title: "Contact",
      email: "Email",
      location: "Location",
      facebook: "Facebook",
      formTitle: "Send a Message",
      name: "Your Name",
      message: "Your Message",
      send: "Send Message",
      success: "Message sent successfully.",
      emailPlaceholder: "Your Email",
    },
    footer: {
      text: "GATRIX Robotics Team. Building the future with innovation.",
      rights: "All rights reserved.",
    },
    stats: {
      members: "Members",
      projects: "Projects",
      events: "Events",
      awards: "Awards",
    },
  },

  bn: {
    nav: {
      home: "হোম",
      about: "আমাদের সম্পর্কে",
      team: "দল",
      projects: "প্রজেক্ট",
      gallery: "গ্যালারি",
      achievements: "অর্জন",
      contact: "যোগাযোগ",
    },
    hero: {
      title: "GATRIX-এ স্বাগতম",
      subtitle: "আমরা রোবোটিক্স ও উদ্ভাবনী প্রযুক্তি নিয়ে কাজ করি।",
      btn: "প্রজেক্ট দেখুন",
      badge: "রোবোটিক্স • উদ্ভাবন • ভবিষ্যৎ",
      typing: [
        "আমরা রোবট তৈরি করি...",
        "আমরা অটোমেশন বানাই...",
        "আমরা প্রযুক্তিতে উদ্ভাবন করি...",
      ],
    },
    about: {
      title: "GATRIX সম্পর্কে",
      desc: "GATRIX একটি রোবোটিক্স গ্রুপ যেখানে আমরা প্রযুক্তি, অটোমেশন এবং দলগত কাজের মাধ্যমে উদ্ভাবনী প্রজেক্ট তৈরি করি।",
    },
    team: {
      title: "আমাদের দল",
      role: "দায়িত্ব",
      skills: "দক্ষতা",
      contact: "যোগাযোগ",
      close: "বন্ধ করুন",
      viewProfile: "প্রোফাইল দেখুন",
    },
    projects: {
      title: "প্রজেক্টসমূহ",
      all: "সব",
      robotics: "রোবোটিক্স",
      iot: "আইওটি",
      automation: "অটোমেশন",
      close: "বন্ধ করুন",
      details:
        "এই প্রজেক্টটি GATRIX রোবোটিক্স পোর্টফোলিওর অংশ। এখানে পূর্ণ বিবরণ, ব্যবহৃত প্রযুক্তি, ছবি এবং ডেমো লিংক যোগ করতে পারবে।",
      search: "প্রজেক্ট খুঁজুন...",
      viewDetails: "বিস্তারিত দেখুন",
      noResults: "কোনো প্রজেক্ট পাওয়া যায়নি।",
      techTitle: "ব্যবহৃত প্রযুক্তি",
      teamTitle: "দলের সদস্যরা",
    },
    gallery: { title: "গ্যালারি" },
    achievements: { title: "অর্জন ও ইভেন্ট" },
    contact: {
      title: "যোগাযোগ",
      email: "ইমেইল",
      location: "অবস্থান",
      facebook: "ফেসবুক",
      formTitle: "মেসেজ পাঠান",
      name: "আপনার নাম",
      message: "আপনার মেসেজ",
      send: "মেসেজ পাঠান",
      success: "মেসেজ সফলভাবে পাঠানো হয়েছে।",
      emailPlaceholder: "আপনার ইমেইল",
    },
    footer: {
      text: "GATRIX রোবোটিক্স টিম। উদ্ভাবনের মাধ্যমে ভবিষ্যৎ গড়ছি।",
      rights: "সর্বস্বত্ব সংরক্ষিত।",
    },
    stats: {
      members: "সদস্য",
      projects: "প্রজেক্ট",
      events: "ইভেন্ট",
      awards: "পুরস্কার",
    },
  },
};

const members = [
  {
    id: 1,
    name: "MD MIRZA GALIB",
    role: "Team Lead",
    image: member1,
    bio: "Leads the team and coordinates robotics projects.",
    skills: ["Leadership", "Robotics", "Planning"],
    email: "mirza.galib.palash@gmail.com",
  },
  {
    id: 2,
    name: "MD. ROMJAN KAZI",
    role: "Programmer",
    image: member2,
    bio: "Works on coding, logic, and automation systems.",
    skills: ["JavaScript", "Arduino", "Problem Solving"],
    email: "romjankazi533@gmail.com",
  },
  {
    id: 3,
    name: "MD MAHBUBUL ALAM",
    role: "Hardware",
    image: member3,
    bio: "Builds hardware structures and manages components.",
    skills: ["Sensors", "Circuits", "Hardware Design"],
    email: "mahbubul.rifat5@gmail.com",
  },
  {
    id: 4,
    name: "IMTIES AHAMMED",
    role: "Designer",
    image: member4,
    bio: "Designs interface, visuals, and project presentation.",
    skills: ["UI Design", "Branding", "Creativity"],
    email: "member4@gatrix.com",
  },
  {
    id: 5,
    name: "TANJILA KHANAM TAMIM",
    role: "Electronics",
    image: member5,
    bio: "Handles connections, boards, and electronic systems.",
    skills: ["Electronics", "PCB", "Wiring"],
    email: "member5@gatrix.com",
  },
  {
    id: 6,
    name: "AFIA HUMAYRA",
    role: "Research",
    image: member6,
    bio: "Researches new ideas, components, and project concepts.",
    skills: ["Research", "Documentation", "Innovation"],
    email: "learningafia969@gmail.com",
  },
];

const projectsData = [
  {
    id: 1,
    title: "Line Follower Robot",
    category: "robotics",
    image: group1,
    shortDescription: "A robot that detects and follows a line automatically.",
    fullDescription:
      "This robot uses sensors to detect a marked line and move accordingly.",
    tech: ["Arduino", "IR Sensor", "C++", "Motor Driver"],
    status: "Completed",
    team: ["Member 1", "Member 2"],
    github: "https://github.com/",
    demo: "https://youtube.com/",
  },
  {
    id: 2,
    title: "Obstacle Avoiding Robot",
    category: "robotics",
    image: group2,
    shortDescription: "A smart bot that detects obstacles and changes direction.",
    fullDescription:
      "This project uses ultrasonic sensors to detect nearby obstacles.",
    tech: ["Arduino", "Ultrasonic Sensor", "Servo Motor"],
    status: "Completed",
    team: ["Member 2", "Member 3"],
    github: "https://github.com/",
    demo: "https://youtube.com/",
  },
  {
    id: 3,
    title: "Smart Home System",
    category: "iot",
    image: group3,
    shortDescription: "An IoT system for controlling home devices remotely.",
    fullDescription:
      "This smart home project connects appliances and control systems using IoT concepts.",
    tech: ["ESP32", "WiFi", "Relay Module", "Blynk"],
    status: "Ongoing",
    team: ["Member 1", "Member 4"],
    github: "https://github.com/",
    demo: "https://youtube.com/",
  },
  {
    id: 4,
    title: "Automatic Gate Control",
    category: "automation",
    image: group1,
    shortDescription: "An automated gate prototype with access logic.",
    fullDescription:
      "This project focuses on automated gate opening and closing.",
    tech: ["Arduino", "RFID", "Servo", "Embedded Logic"],
    status: "Testing",
    team: ["Member 5", "Member 6"],
    github: "https://github.com/",
    demo: "https://youtube.com/",
  },
];

const galleryImages = [
  { id: 1, title: "Team Session", src: gallery1 },
  { id: 2, title: "Robot Build", src: gallery2 },
  { id: 3, title: "Workshop Day", src: gallery3 },
  { id: 4, title: "Testing Phase", src: gallery4 },
  { id: 5, title: "Project Showcase", src: gallery5 },
  { id: 6, title: "Competition Preparation", src: gallery6 },
];

const statsData = [
  { id: 1, value: 6, key: "members" },
  { id: 2, value: 4, key: "projects" },
  { id: 3, value: 3, key: "events" },
  { id: 4, value: 2, key: "awards" },
];

function CounterCard({ value, label, theme }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1200;
    const stepTime = Math.max(Math.floor(duration / value), 50);

    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= value) clearInterval(timer);
    }, stepTime);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <div
      className={`rounded-3xl border p-6 text-center transition hover:-translate-y-2 hover:shadow-[0_0_20px_#22d3ee] ${
        theme === "dark"
          ? "border-cyan-500/20 bg-slate-900"
          : "border-slate-300 bg-white"
      }`}
    >
      <h3 className="text-4xl font-extrabold text-cyan-400">{count}+</h3>
      <p className="mt-2 text-sm uppercase tracking-wider">{label}</p>
    </div>
  );
}

export default function Home()



{
  const [theme, setTheme] = useState("dark");
  const [language, setLanguage] = useState("en");
  const [filter, setFilter] = useState("all");
  const [activeSection, setActiveSection] = useState("home");
  const [loading, setLoading] = useState(true);

  const [achievements, setAchievements] = useState([]);
  const [siteLogo, setSiteLogo] = useState(logo);


const [galleryItems, setGalleryItems] = useState([]);

const [heroContent, setHeroContent] = useState(null);


  const [heroSlides, setHeroSlides] = useState([]);
  const [heroSettings, setHeroSettings] = useState({
    slide_interval: 5000,
    show_arrows: true,
  });

  useEffect(() => {
    fetchAchievements();
    fetchSiteSettings();
    fetchHeroData();
    fetchGalleryImages();
    
    fetchHeroContent();
  }, []);



//function added
async function fetchGalleryImages() {
  const { data, error } = await supabase
    .from("gallery_images")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (!error && data) {
    setGalleryItems(
      data.map((item) => ({
        id: item.id,
        title: item.title,
        src: item.image_url,
        image_url: item.image_url,
      }))
    );
  }
}






//function2


async function fetchHeroContent() {
  const { data, error } = await supabase
    .from("hero_content")
    .select("*")
    .eq("id", 1)
    .single();

  if (!error && data) {
    setHeroContent(data);
  }
}

















  async function fetchHeroData() {
    const { data: slides, error: slideError } = await supabase
      .from("hero_slides")
      .select("*")
      .order("sort_order", { ascending: true });

    if (!slideError && slides && slides.length > 0) {
      setHeroSlides(slides.map((item) => item.image_url));
    } else {
      setHeroSlides(heroImages);
    }

    const { data: settings, error: settingsError } = await supabase
      .from("hero_settings")
      .select("*")
      .eq("id", 1)
      .single();

    if (!settingsError && settings) {
      setHeroSettings({
        slide_interval: settings.slide_interval || 5000,
        show_arrows: settings.show_arrows ?? true,
      });
    }
  }

  async function fetchSiteSettings() {
    const { data, error } = await supabase
      .from("site_settings")
      .select("logo_url")
      .eq("id", 1)
      .single();

    if (!error && data?.logo_url) {
      setSiteLogo(data.logo_url);
    }
  }

  async function fetchAchievements() {
    const { data, error } = await supabase
      .from("achievements")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) {
      setAchievements(data || []);
    }
  }

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const savedLanguage = localStorage.getItem("language");

    if (savedTheme) setTheme(savedTheme);
    if (savedLanguage) setLanguage(savedLanguage);
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", theme);
    localStorage.setItem("language", language);
  }, [theme, language]);

  useEffect(() => {
    const sections = [
      "home",
      "about",
      "team",
      "projects",
      "gallery",
      "achievements",
      "contact",
    ];

    const onScroll = () => {
      let current = "home";

      sections.forEach((id) => {
        const section = document.getElementById(id);
        if (section) {
          const top = section.offsetTop - 120;
          const height = section.offsetHeight;

          if (window.scrollY >= top && window.scrollY < top + height) {
            current = id;
          }
        }
      });

      setActiveSection(current);
    };

    window.addEventListener("scroll", onScroll);
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2800);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loader />;
  }

  const t = content[language];


const dynamicHero = heroContent
  ? language === "en"
    ? {
        title: heroContent.title_en || t.hero.title,
        subtitle: heroContent.subtitle_en || t.hero.subtitle,
        badge: heroContent.badge_en || t.hero.badge,
        btn: heroContent.btn_en || t.hero.btn,
        typing:
          heroContent.typing_en && heroContent.typing_en.length > 0
            ? heroContent.typing_en
            : t.hero.typing,
      }
    : {
        title: heroContent.title_bn || t.hero.title,
        subtitle: heroContent.subtitle_bn || t.hero.subtitle,
        badge: heroContent.badge_bn || t.hero.badge,
        btn: heroContent.btn_bn || t.hero.btn,
        typing:
          heroContent.typing_bn && heroContent.typing_bn.length > 0
            ? heroContent.typing_bn
            : t.hero.typing,
      }
  : t.hero;









  const filteredProjects =
    filter === "all"
      ? projectsData
      : projectsData.filter((project) => project.category === filter);

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        theme === "dark"
          ? "bg-slate-950 text-white"
          : "bg-slate-100 text-slate-900"
      }`}
    >



















<NoticeBar language={language} />
      <Navbar
        nav={t.nav}
        theme={theme}
        setTheme={setTheme}
        language={language}
        setLanguage={setLanguage}
        logo={siteLogo}
        activeSection={activeSection}
      />

      <Hero
  hero={dynamicHero}
  theme={theme}
  heroImages={heroSlides.length > 0 ? heroSlides : heroImages}
  slideInterval={heroSettings.slide_interval}
  showArrows={heroSettings.show_arrows}
/>



      <About about={t.about} theme={theme} />

      <section className="px-4 py-10 sm:px-6">
        <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 md:grid-cols-4">
          {statsData.map((item) => (
            <CounterCard
              key={item.id}
              value={item.value}
              label={t.stats[item.key]}
              theme={theme}
            />
          ))}
        </div>
      </section>

      <Team
        title={t.team.title}
        roleLabel={t.team.role}
        members={members}
        theme={theme}
        teamText={t.team}
      />

      <Projects
        title={t.projects.title}
        labels={t.projects}
        filter={filter}
        setFilter={setFilter}
        projects={filteredProjects}
        theme={theme}
      />

      

<Gallery
  title={t.gallery.title}
  images={galleryItems.length > 0 ? galleryItems : galleryImages}
  theme={theme}
/>



      <Achievements
        title={t.achievements.title}
        items={achievements}
        theme={theme}
      />

      <Contact contact={t.contact} theme={theme} />
      <Footer footer={t.footer} theme={theme} />
<AIAssistant language={language} theme={theme} />
<BirthdayPopup />

    </div>
  );
}
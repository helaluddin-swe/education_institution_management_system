export const formatTime = (totalSeconds) => {
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;
  return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};
export const jobsData = [
  {
    id: 1,
    title: "Senior Full Stack Engineer",
    category: "Web Development",
    locationType: "Remote",
    isFavorite: true,
    date: "Mar 28",
    salary: "$120k - $150k",
    isApplyed: false,
  },
  {
    id: 2,
    title: "UI/UX Product Designer",
    category: "Web Design",
    locationType: "Hybrid",
    isFavorite: false,
    date: "Mar 29",
    salary: "$90k - $110k",
    isApplyed: false,
  },
  {
    id: 3,
    title: "Technical Content Marketer",
    category: "Marketing",
    locationType: "Remote",
    isFavorite: true,
    date: "Mar 30",
    salary: "$70k - $90k",
    isApplyed: false,
  },
  {
    id: 4,
    title: "DevOps Infrastructure Lead",
    category: "Network Engineer",
    locationType: "On-Site",
    isFavorite: false,
    date: "Mar 31",
    salary: "$140k - $180k",
    isApplyed: false,
  },
  {
    id: 5,
    title: "Junior Frontend Developer",
    category: "Frontend Engineer",
    locationType: "Remote",
    isFavorite: false,
    date: "Apr 01",
    salary: "$60k - $80k",
    isApplyed: false,
  },
];

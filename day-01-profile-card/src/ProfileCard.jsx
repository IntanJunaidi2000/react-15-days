function ProfileCard() {
  const skills = ["Java", "Spring Boot", "React", "MySQL", "REST APIs", "Git"]

  const projects = [
    { 
        name: "PlantPal", 
        desc: "Full-stack plant care app · Spring Boot + React + MySQL",
        link: "https://github.com/IntanJunaidi2000/plantpal-project"
    },
    { 
        name: "Vis", 
        desc: "Browser-based writing app - Obsidian-style",
        link: "https://github.com/IntanJunaidi2000/writingWithAi-WebApp"
    },
    { 
        name: "Notification Platform", 
        desc: "Async campaign engine with retry, rate limiting & CSV streaming",
        link: "https://github.com/IntanJunaidi2000/notification-campaign-platform-backend"
    }
  ]

  return(
    <div className="card">

     <div className="card-header">
        <div className="avatar">IMJ</div>
            <div>
                <div className="name-row">
                <h1 className="name">Intan Maisarah Mohd Junaidi</h1>
                <span className="open-to-work">✦ Open to work</span>
                </div>
                <p className="title">Software Engineer</p>
                <p className="tagline">Building full-stack apps with Java & React</p>
                <p className="availability">📍 Kuala Lumpur · Selangor</p>
            </div>
        </div>

      <div className="card-section">
        <p className="label">Skills</p>
        <div className="skills-grid">
          {skills.map((skill) => (
              <span key={skill} className="chip">{skill}</span>
          ))}
         </div>
        </div>

      <div className="card-section">
        <p className="label">Projects</p>
          {projects.map((project) => (
              <div key={project.name} className="project-row">
                <span className="project-name">{project.name}</span>
                <span className="project-desc">{project.desc}</span>
                <a href={project.link} target="_blank" className="project-link">↗</a>
              </div>
          ))}
        </div>

        <div className="card-section">
            <p className="label">Links</p>
            <div className="links-row">
                <a href= "https://github.com/IntanJunaidi2000" target="_blank">GitHub</a>
                <a href= "https://www.linkedin.com/in/intan-maisarah-a66013243/" target="_blank">LinkedIn</a>
                <a href="mailto:intanmai2000@gmail.com?subject=Hey, I'd like to connect!">Email</a>
            </div>
        </div>

    </div>
  )


}

export default ProfileCard
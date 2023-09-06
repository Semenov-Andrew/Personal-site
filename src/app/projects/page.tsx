import { type FC } from "react"

interface Repo {
    id: string
    name: string
    description: string | null
    html_url: string
}

interface IProject {
    apiUrl: string
}

const projects: IProject[] = [
    {
        apiUrl: "https://api.github.com/repos/Friendly-neighborhood-development/Fnd_games_store",
    },
    {
        apiUrl: "https://api.github.com/repos/Semenov-Andrew/Personal-site",
    },
    {
        apiUrl: "https://api.github.com/repos/Andrew-Sem/volpi-qa",
    },
]

const Project: FC<IProject> = async ({ apiUrl }) => {
    const res = await fetch(apiUrl)
    const repo = (await res.json()) as Repo
    return (
        <a
            className="h-40 space-y-4 rounded-lg border p-4 duration-150 hover:scale-105"
            href={repo.html_url}
        >
            <h2 className="text-2xl font-semibold">{repo.name}</h2>
            <hr />
            <p className="text-muted-foreground">{repo.description}</p>
        </a>
    )
}

const ProjectsPage: FC = () => {
    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
                <Project apiUrl={project.apiUrl} key={project.apiUrl} />
            ))}
        </div>
    )
}

export default ProjectsPage

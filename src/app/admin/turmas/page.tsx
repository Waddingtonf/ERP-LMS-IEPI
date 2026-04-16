import TurmasClient from "./_components/TurmasClient"
import { getTurmas } from "@/lms/actions/turmaActions"

export default async function TurmasPage() {
    const turmas = await getTurmas()

    return <TurmasClient turmas={turmas} />
}

"use server";

import { getCatalogoRepository } from "@/lms/repositories";
import type { CatalogoCurso, AreaCurso, ModalidadeCurso, NivelCurso } from "@/lms/repositories/CatalogoRepository";

export async function getCursosCatalogo(filtros?: {
    area?: AreaCurso;
    modalidade?: ModalidadeCurso;
    nivel?: NivelCurso;
    inscricoesAbertas?: boolean;
}): Promise<CatalogoCurso[]> {
    return getCatalogoRepository().findAll(filtros);
}

export async function getCursoDetalhe(id: string): Promise<CatalogoCurso | null> {
    return getCatalogoRepository().findById(id);
}

export async function getCursoBySlug(slug: string): Promise<CatalogoCurso | null> {
    return getCatalogoRepository().findBySlug(slug);
}

export async function getCursosDestaque(): Promise<CatalogoCurso[]> {
    return getCatalogoRepository().findDestaques();
}

export async function getCursosRelacionados(cursoId: string): Promise<CatalogoCurso[]> {
    return getCatalogoRepository().findRelacionados(cursoId);
}

export type { CatalogoCurso, AreaCurso, ModalidadeCurso, NivelCurso };

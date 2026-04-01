"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ShieldCheck, FileText, Lock, Globe } from "lucide-react";

export default function TerminosPage() {
    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-500">
            <div className="max-w-4xl mx-auto">
                {/* Header / Brand */}
                <div className="flex flex-col sm:flex-row items-center justify-between mb-12 gap-6 bg-white p-8 rounded-3xl shadow-sm border border-slate-200/60">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="p-2 rounded-xl bg-slate-100 group-hover:bg-slate-200 transition-colors">
                            <ChevronLeft className="h-5 w-5 text-slate-600" />
                        </div>
                        <span className="text-sm font-semibold text-slate-500">Volver a la landing</span>
                    </Link>
                    
                    <div className="relative">
                        <Image
                            src="/brand/zanoo-logo-color-v2.png"
                            alt="Zanoo"
                            width={160}
                            height={50}
                            className="h-10 w-auto object-contain"
                            priority
                        />
                    </div>
                </div>

                {/* Main Document Card */}
                <div className="bg-white rounded-[40px] shadow-xl shadow-slate-200/50 border border-slate-200/60 overflow-hidden">
                    {/* Document Header Accent */}
                    <div className="h-2 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600" />
                    
                    <div className="p-8 sm:p-16">
                        <div className="flex items-center gap-3 mb-6 text-blue-600">
                            <ShieldCheck className="h-6 w-6" />
                            <span className="text-xs font-black uppercase tracking-[0.2em]">Documento Oficial</span>
                        </div>

                        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight mb-4 uppercase tracking-tighter">
                            Términos, Condiciones y <br />
                            <span className="text-blue-600">Política de Privacidad</span>
                        </h1>
                        <p className="text-slate-400 text-sm font-medium mb-12">Versión 2026.1 · Actualizado en Abril 2026</p>

                        <div className="prose prose-slate max-w-none space-y-10">
                            <section>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 rounded-lg bg-blue-50">
                                        <Globe className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <h2 className="text-xl font-bold text-slate-800 m-0">1. MARCO LEGAL Y REGULATORIO</h2>
                                </div>
                                <p className="text-slate-600 leading-relaxed">
                                    La plataforma ZANOO (en adelante, "la Plataforma") opera bajo el estricto cumplimiento de la normativa de salud digital de la República Argentina. Se deja constancia de que la Plataforma se encuentra en proceso de homologación ante el Registro Nacional de Plataformas Digitales Sanitarias (ReNaPDiS), conforme a la Resolución MSAL 278/2024 y sus actualizaciones de 2026.
                                </p>
                                <p className="text-slate-600 leading-relaxed mt-4">
                                    Zanoo adhiere a los estándares de interoperabilidad HL7 FHIR y terminología SNOMED CT, integrándose a la Estrategia Nacional de Salud Digital para garantizar la continuidad del cuidado del paciente.
                                </p>
                            </section>

                            <section>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 rounded-lg bg-blue-50">
                                        <Lock className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <h2 className="text-xl font-bold text-slate-800 m-0">2. PROTECCIÓN DE DATOS PERSONALES (LEY 25.326)</h2>
                                </div>
                                <p className="text-slate-600 leading-relaxed">
                                    En cumplimiento con la Ley de Protección de Datos Personales Nº 25.326, ZANO garantiza la privacidad y confidencialidad de la información de los pacientes.
                                </p>
                                <ul className="mt-4 space-y-3">
                                    <li className="flex gap-3 text-slate-600">
                                        <span className="font-bold text-slate-800 shrink-0">· Responsable de Archivo:</span>
                                        <span>El Centro de Salud que utiliza la Plataforma es el titular del archivo de datos.</span>
                                    </li>
                                    <li className="flex gap-3 text-slate-600">
                                        <span className="font-bold text-slate-800 shrink-0">· Procesador de Datos:</span>
                                        <span>Zanoo actúa únicamente como procesador tecnológico bajo protocolos de seguridad AES-256 en infraestructura Google Cloud.</span>
                                    </li>
                                    <li className="flex gap-3 text-slate-600">
                                        <span className="font-bold text-slate-800 shrink-0">· Derechos ARCO:</span>
                                        <span>Los usuarios pueden ejercer sus derechos de Acceso, Rectificación, Cancelación y Oposición conforme a la normativa vigente.</span>
                                    </li>
                                </ul>
                            </section>

                            <section>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 rounded-lg bg-blue-50">
                                        <FileText className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <h2 className="text-xl font-bold text-slate-800 m-0">3. DERECHOS DEL PACIENTE (LEY 26.529)</h2>
                                </div>
                                <p className="text-slate-600 leading-relaxed">
                                    La Plataforma facilita el ejercicio de los derechos del paciente, incluyendo la autonomía de la voluntad, la información sanitaria y el acceso a su historia clínica digitalizada de manera segura y personal.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold text-slate-800 mb-4 border-l-4 border-blue-600 pl-4">4. CONSENTIMIENTO INFORMADO</h2>
                                <p className="text-slate-600 leading-relaxed">
                                    Al utilizar Zanoo, tanto los profesionales de la salud como los centros asistenciales se comprometen a obtener el consentimiento informado de los pacientes para el tratamiento telemático de sus datos de salud, conforme a los protocolos establecidos por el Ministerio de Salud de la Nación y la Estrategia Nacional de Salud Digital.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold text-slate-800 mb-4 border-l-4 border-blue-600 pl-4">5. SEGURIDAD DE LA INFORMACIÓN</h2>
                                <p className="text-slate-600 leading-relaxed">
                                    Zanoo implementa medidas técnicas y organizativas de nivel médico para prevenir la pérdida, mal uso, alteración, acceso no autorizado y robo de los datos facilitados. La infraestructura se encuentra alojada en servidores de alta seguridad mediante una asociación tecnológica con Google Cloud Partner, garantizando redundancia y alta disponibilidad.
                                </p>
                            </section>

                            <section className="pt-8 border-t border-slate-100">
                                <h2 className="text-xl font-bold text-slate-800 mb-4">6. CONTACTO</h2>
                                <p className="text-slate-600 leading-relaxed">
                                    Para consultas legales, requerimientos de auditoría o ejercicio de derechos sobre datos personales, los responsables de los centros o pacientes autorizados pueden dirigirse a:
                                </p>
                                <div className="mt-6 p-6 rounded-2xl bg-slate-50 border border-slate-200/60 inline-block">
                                    <a href="mailto:legales@zanoo.com.ar" className="text-blue-600 font-bold hover:underline">legales@zanoo.com.ar</a>
                                    <div className="text-xs text-slate-400 mt-1 uppercase tracking-widest">Asuntos Legales & Cumplimiento</div>
                                </div>
                            </section>
                        </div>
                    </div>

                    {/* Footer Accent */}
                    <div className="bg-slate-50 p-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-bold">
                            © 2026 Zanoo — Inteligencia Sanitaria
                        </div>
                        <div className="flex gap-4">
                            <span className="text-[10px] px-2 py-1 bg-white border border-slate-200 rounded text-slate-500 uppercase font-bold">Inscripción AAIP en trámite</span>
                            <span className="text-[10px] px-2 py-1 bg-white border border-slate-200 rounded text-slate-500 uppercase font-bold">HL7 FHIR compliant</span>
                        </div>
                    </div>
                </div>

                <div className="mt-12 text-center text-slate-400 text-xs">
                    <p>Este documento es vinculante para el uso de la plataforma Zanoo y sus servicios asociados.</p>
                </div>
            </div>
        </div>
    );
}

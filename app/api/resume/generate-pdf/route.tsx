import React from 'react';
import { NextRequest, NextResponse } from 'next/server';
import { renderToBuffer, Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

export const runtime = 'nodejs';

const parseSocials = (socials?: any): string[] => {
  if (!socials) return [];
  if (Array.isArray(socials)) {
    return socials.map(s => String(s).trim()).filter(Boolean);
  }
  if (typeof socials !== "string") return [];
  const cleaned = socials
    .replace(/https?:\/\/\s*[,|]\s*/gi, "https://")
    .replace(/www\.\s*[,|]\s*/gi, "www.");
  return cleaned
    .split(/[,|\n]+/)
    .map(s => s.trim().replace(/^\|\s*/, "").replace(/\s*\|$/, ""))
    .filter(Boolean);
};

const styles = StyleSheet.create({
  page: { paddingHorizontal: 40, paddingVertical: 40, fontFamily: 'Helvetica', fontSize: 10, color: '#111827' },
  header: { flexDirection: 'row', alignItems: 'flex-start', borderBottom: '1.5pt solid #1e3a8a', paddingBottom: 12, marginBottom: 15 },
  logoContainer: { marginRight: 30 },
  logo: { width: 110, maxHeight: 75, objectFit: 'contain' },
  headerText: { flex: 1 },
  name: { fontSize: 17, fontWeight: 'bold', color: '#1e3a8a', textTransform: 'uppercase', marginBottom: 5 },
  contact: { fontSize: 9, color: '#4b5563', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' },
  contactItem: { marginRight: 4 },
  separator: { marginHorizontal: 4, color: '#9ca3af' },
  section: { marginBottom: 12 },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1e3a8a',
    textTransform: 'uppercase',
    borderBottom: '1pt solid #bfdbfe',
    marginBottom: 6,
    paddingBottom: 2
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 2 },
  itemTitle: { fontSize: 10, color: '#1e3a8a' },
  itemSubtitle: { fontSize: 9, color: '#374151' },
  dateText: { fontSize: 9, color: '#6b7280' },
  text: { fontSize: 9, lineHeight: 1.4, color: '#374151' },
  bulletRow: { flexDirection: 'row', marginBottom: 2 },
  bulletPoint: { width: 10, fontSize: 9, color: '#374151' },
  bulletContent: { flex: 1, fontSize: 9, lineHeight: 1.4, color: '#374151' },
  skillRow: { flexDirection: 'row', marginBottom: 3 },
  skillCategory: { width: 90, fontSize: 9, fontWeight: 'bold', color: '#111827' },
  skillList: { flex: 1, fontSize: 9, color: '#374151' }
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { resumeData, logoDataUrl } = body;

    if (!resumeData) {
      return NextResponse.json({ error: "Missing resumeData" }, { status: 400 });
    }

    const doc = (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              {logoDataUrl && typeof logoDataUrl === 'string' && logoDataUrl.startsWith("data:") ? (
                <Image src={logoDataUrl} style={styles.logo} />
              ) : null}
            </View>
            <View style={styles.headerText}>
              <Text style={styles.name}>{resumeData.name || "Resume"}</Text>
              <View style={styles.contact}>
                {resumeData.location && <Text style={styles.contactItem}>{resumeData.location}</Text>}
                {resumeData.location && (resumeData.email || resumeData.phone) && <Text style={styles.separator}>|</Text>}
                {resumeData.email && <Text style={styles.contactItem}>{resumeData.email}</Text>}
                {resumeData.email && resumeData.phone && <Text style={styles.separator}>|</Text>}
                {resumeData.phone && <Text style={styles.contactItem}>{resumeData.phone}</Text>}
              </View>
              {parseSocials(resumeData.socials).length > 0 && (
                <View style={[styles.contact, { marginTop: 3 }]}>
                  {parseSocials(resumeData.socials).map((soc, idx, arr) => (
                    <View key={idx} style={{ flexDirection: 'row' }}>
                      <Text style={styles.contactItem}>{soc}</Text>
                      {idx < arr.length - 1 && <Text style={styles.separator}>|</Text>}
                    </View>
                  ))}
                </View>
              )}
            </View>
          </View>

          {resumeData.executiveSummary ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Profile Summary</Text>
              <Text style={styles.text}>{resumeData.executiveSummary}</Text>
            </View>
          ) : null}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Technical Skills</Text>
            {resumeData.categorizedSkills && Object.entries(resumeData.categorizedSkills).map(([category, skills]) => (Array.isArray(skills) && skills.length > 0) ? (
              <View key={category} style={styles.skillRow}>
                <Text style={styles.skillCategory}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}:
                </Text>
                <Text style={styles.skillList}>{(skills as string[]).join(', ')}</Text>
              </View>
            ) : null)}
          </View>

          {resumeData.experience && Array.isArray(resumeData.experience) && resumeData.experience.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Professional Experience</Text>
              {resumeData.experience.map((exp: any, i: number) => (
                <View key={i} style={{ marginBottom: 6 }}>
                  <View style={styles.row}>
                    <Text style={styles.itemTitle}>{exp.title}</Text>
                    <Text style={styles.dateText}>{exp.duration}</Text>
                  </View>
                  <Text style={[styles.itemSubtitle, { marginBottom: 3 }]}>{exp.company}</Text>
                  {exp.description && Array.isArray(exp.description) && exp.description.map((bullet: string, j: number) => (
                    <View key={j} style={styles.bulletRow}>
                      <Text style={styles.bulletPoint}>•</Text>
                      <Text style={styles.bulletContent}>{bullet}</Text>
                    </View>
                  ))}
                </View>
              ))}
            </View>
          )}

          {resumeData.projects && Array.isArray(resumeData.projects) && resumeData.projects.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Projects</Text>
              {resumeData.projects.map((proj: any, i: number) => (
                <View key={i} style={{ marginBottom: 6 }}>
                  <View style={styles.row}>
                    <Text style={styles.itemTitle}>{proj.name}</Text>
                    <Text style={styles.dateText}>{proj.duration}</Text>
                  </View>
                  {proj.techStack && <Text style={[styles.itemSubtitle, { marginBottom: 3 }]}>Tech Stack: {proj.techStack}</Text>}
                  {proj.description && Array.isArray(proj.description) && proj.description.map((bullet: string, j: number) => (
                    <View key={j} style={styles.bulletRow}>
                      <Text style={styles.bulletPoint}>•</Text>
                      <Text style={styles.bulletContent}>{bullet}</Text>
                    </View>
                  ))}
                </View>
              ))}
            </View>
          )}

          {resumeData.education && Array.isArray(resumeData.education) && resumeData.education.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Education</Text>
              {resumeData.education.map((edu: any, i: number) => (
                <View key={i} style={{ marginBottom: 6 }}>
                  <View style={styles.row}>
                    <Text style={[styles.itemTitle, { color: '#111827' }]}>{edu.institution}</Text>
                    <Text style={styles.dateText}>{edu.duration}</Text>
                  </View>
                  <Text style={styles.text}>{edu.degree} {edu.score ? `| ${edu.score}` : ''}</Text>
                </View>
              ))}
            </View>
          )}

          {resumeData.certifications && Array.isArray(resumeData.certifications) && resumeData.certifications.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Certifications & Licenses</Text>
              {resumeData.certifications.map((cert: any, i: number) => (
                <View key={i} style={styles.bulletRow}>
                  <Text style={styles.bulletPoint}>•</Text>
                  <Text style={styles.bulletContent}>
                    <Text style={{ fontWeight: 'bold', color: '#1e3a8a' }}>{cert.name}</Text>
                    {cert.issuer ? ` – ${cert.issuer}` : ''}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {resumeData.activities && Array.isArray(resumeData.activities) && resumeData.activities.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Activities, Leadership & Achievements</Text>
              {resumeData.activities.map((act: string, i: number) => (
                <View key={i} style={styles.bulletRow}>
                  <Text style={styles.bulletPoint}>•</Text>
                  <Text style={styles.bulletContent}>{act}</Text>
                </View>
              ))}
            </View>
          )}

          {resumeData.interests && Array.isArray(resumeData.interests) && resumeData.interests.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Interests</Text>
              <Text style={styles.text}>{resumeData.interests.join(', ')}</Text>
            </View>
          )}

        </Page>
      </Document>
    );

    const buffer = await renderToBuffer(doc);

    return new Response(buffer as any, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${(resumeData.name || "Resume").replace(/\s+/g, '_')}_Resume.pdf"`,
      },
    });
  } catch (err: any) {
    console.error("Server-side PDF generation error:", err);
    return NextResponse.json({ error: err.message || "Failed to generate PDF" }, { status: 500 });
  }
}

import { Semester } from '@/types';
import { Share, Platform } from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { calculateGPA, calculateCGPA, getGradeFromScore } from '@/utils/calculations';

export class DataExportService {
  async exportToJSON(semesters: Semester[], userEmail: string): Promise<void> {
    try {
      const exportData = {
        exportDate: new Date().toISOString(),
        userEmail,
        semesters,
        summary: this.generateSummary(semesters),
      };

      const jsonString = JSON.stringify(exportData, null, 2);
      const fileName = `student_atlas_backup_${new Date().getTime()}.json`;

      if (Platform.OS === 'web') {
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.click();
        URL.revokeObjectURL(url);
      } else {
        const fileUri = `${FileSystem.documentDirectory}${fileName}`;
        await FileSystem.writeAsStringAsync(fileUri, jsonString);
        
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(fileUri);
        }
      }
    } catch (error) {
      console.error('Failed to export JSON:', error);
      throw new Error('Failed to export data. Please try again.');
    }
  }

  async exportToPDF(semesters: Semester[], userEmail: string): Promise<void> {
    try {
      const html = this.generatePDFHTML(semesters, userEmail);
      
      const { uri } = await Print.printToFileAsync({ html });
      
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: 'Export Academic Report',
          UTI: 'com.adobe.pdf',
        });
      }
    } catch (error) {
      console.error('Failed to export PDF:', error);
      throw new Error('Failed to generate PDF. Please try again.');
    }
  }

  private generateSummary(semesters: Semester[]) {
    const pastSemesters = semesters.filter(s => !s.isCurrent);
    const cgpa = calculateCGPA(pastSemesters);
    const totalCourses = pastSemesters.reduce((sum, s) => sum + s.courses.length, 0);
    const completedCourses = pastSemesters.reduce(
      (sum, s) => sum + s.courses.filter(c => c.finalScore !== undefined).length,
      0
    );

    return {
      cgpa,
      totalSemesters: semesters.length,
      totalCourses,
      completedCourses,
    };
  }

  private generatePDFHTML(semesters: Semester[], userEmail: string): string {
    const summary = this.generateSummary(semesters);
    
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Student Atlas - Academic Report</title>
          <style>
            body {
              font-family: 'Helvetica Neue', Arial, sans-serif;
              padding: 40px;
              color: #333;
            }
            .header {
              text-align: center;
              margin-bottom: 40px;
              padding-bottom: 20px;
              border-bottom: 3px solid #4A90E2;
            }
            h1 {
              color: #4A90E2;
              margin: 0;
              font-size: 32px;
            }
            .subtitle {
              color: #666;
              margin-top: 10px;
              font-size: 14px;
            }
            .summary {
              background: #f5f5f5;
              padding: 20px;
              border-radius: 8px;
              margin-bottom: 30px;
            }
            .summary-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 15px;
            }
            .summary-item {
              padding: 10px;
            }
            .summary-label {
              font-size: 12px;
              color: #666;
              text-transform: uppercase;
              letter-spacing: 1px;
            }
            .summary-value {
              font-size: 24px;
              font-weight: bold;
              color: #4A90E2;
              margin-top: 5px;
            }
            .semester {
              margin-bottom: 40px;
              page-break-inside: avoid;
            }
            .semester-header {
              background: #4A90E2;
              color: white;
              padding: 15px 20px;
              border-radius: 8px 8px 0 0;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            .semester-title {
              font-size: 20px;
              font-weight: bold;
            }
            .semester-gpa {
              font-size: 18px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
            }
            th {
              background: #f8f8f8;
              padding: 12px;
              text-align: left;
              font-weight: 600;
              font-size: 12px;
              text-transform: uppercase;
              letter-spacing: 1px;
              border-bottom: 2px solid #ddd;
            }
            td {
              padding: 12px;
              border-bottom: 1px solid #eee;
            }
            .course-code {
              font-weight: 600;
              color: #333;
            }
            .grade {
              font-weight: bold;
              padding: 4px 8px;
              border-radius: 4px;
            }
            .grade-a { background: #4CAF50; color: white; }
            .grade-b { background: #8BC34A; color: white; }
            .grade-c { background: #FFC107; color: white; }
            .grade-d { background: #FF9800; color: white; }
            .grade-e { background: #FF5722; color: white; }
            .grade-f { background: #F44336; color: white; }
            .footer {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 2px solid #ddd;
              text-align: center;
              color: #666;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Student Atlas</h1>
            <div class="subtitle">Academic Performance Report</div>
            <div class="subtitle">${userEmail}</div>
            <div class="subtitle">Generated on ${new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</div>
          </div>

          <div class="summary">
            <div class="summary-grid">
              <div class="summary-item">
                <div class="summary-label">Cumulative GPA</div>
                <div class="summary-value">${summary.cgpa.toFixed(2)}</div>
              </div>
              <div class="summary-item">
                <div class="summary-label">Total Semesters</div>
                <div class="summary-value">${summary.totalSemesters}</div>
              </div>
              <div class="summary-item">
                <div class="summary-label">Total Courses</div>
                <div class="summary-value">${summary.totalCourses}</div>
              </div>
              <div class="summary-item">
                <div class="summary-label">Completed Courses</div>
                <div class="summary-value">${summary.completedCourses}</div>
              </div>
            </div>
          </div>

          ${semesters.map(semester => {
            const semesterGPA = calculateGPA(semester.courses);
            return `
              <div class="semester">
                <div class="semester-header">
                  <div class="semester-title">${semester.name}</div>
                  <div class="semester-gpa">GPA: ${semesterGPA.toFixed(2)}</div>
                </div>
                <table>
                  <thead>
                    <tr>
                      <th>Course Code</th>
                      <th>Course Title</th>
                      <th>Units</th>
                      <th>CA Score</th>
                      <th>Exam Score</th>
                      <th>Total</th>
                      <th>Grade</th>
                      <th>Grade Point</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${semester.courses.map(course => {
                      const total = course.finalScore !== undefined ? course.finalScore : 0;
                      const grade = getGradeFromScore(total);
                      const gradeClass = `grade-${grade.letter.toLowerCase()}`;
                      return `
                        <tr>
                          <td class="course-code">${course.code}</td>
                          <td>${course.title}</td>
                          <td>${course.units}</td>
                          <td>${course.caScore || '-'}</td>
                          <td>${course.examScore !== undefined ? course.examScore : '-'}</td>
                          <td>${total}</td>
                          <td><span class="grade ${gradeClass}">${grade.letter}</span></td>
                          <td>${grade.point.toFixed(1)}</td>
                        </tr>
                      `;
                    }).join('')}
                  </tbody>
                </table>
              </div>
            `;
          }).join('')}

          <div class="footer">
            <p>This report was generated by Student Atlas</p>
            <p>Babcock University Academic Performance Tracking System</p>
          </div>
        </body>
      </html>
    `;
  }
}

export const dataExportService = new DataExportService();

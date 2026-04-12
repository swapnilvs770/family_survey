import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const exportToPDF = (data, filters = {}) => {
  const doc = new jsPDF();

  // Title
  doc.setFontSize(18);
  doc.setTextColor(0, 0, 0);
  doc.text('कुटुंब सर्वे अहवाल', 105, 15, { align: 'center' });
  
  doc.setFontSize(12);
  doc.text('Family Survey Report', 105, 22, { align: 'center' });

  // Filter information
  let yPos = 35;
  doc.setFontSize(10);
  
  if (Object.keys(filters).length > 0) {
    doc.setTextColor(100, 100, 100);
    doc.text('Applied Filters:', 14, yPos);
    yPos += 6;

    if (filters.ageMin !== undefined || filters.ageMax !== undefined) {
      const ageText = `Age Range: ${filters.ageMin || 0} - ${filters.ageMax || '∞'}`;
      doc.text(ageText, 20, yPos);
      yPos += 6;
    }
    if (filters.gender && filters.gender !== 'all') {
      doc.text(`Gender: ${filters.gender}`, 20, yPos);
      yPos += 6;
    }
    if (filters.search) {
      doc.text(`Search: ${filters.search}`, 20, yPos);
      yPos += 6;
    }
    yPos += 5;
  }

  // Table data
  const tableData = data.map((member, index) => [
    index + 1,
    member.family_id,
    member.name,
    member.age,
    member.gender,
    member.relation,
    new Date(member.dob).toLocaleDateString('en-IN')
  ]);

  // Generate table
  doc.autoTable({
    head: [['#', 'Family ID', 'Name', 'Age', 'Gender', 'Relation', 'DOB']],
    body: tableData,
    startY: yPos,
    theme: 'grid',
    headStyles: {
      fillColor: [0, 0, 0],
      textColor: [255, 215, 0],
      fontSize: 10,
      fontStyle: 'bold',
    },
    bodyStyles: {
      fontSize: 9,
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
    margin: { top: 10 },
  });

  // Footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(9);
    doc.setTextColor(128, 128, 128);
    doc.text(
      `Page ${i} of ${pageCount}`,
      doc.internal.pageSize.width / 2,
      doc.internal.pageSize.height - 10,
      { align: 'center' }
    );
    doc.text(
      `Generated on: ${new Date().toLocaleString('en-IN')}`,
      14,
      doc.internal.pageSize.height - 10
    );
  }

  // Save PDF
  const fileName = `family_survey_${new Date().getTime()}.pdf`;
  doc.save(fileName);
};

export const exportFamiliesToPDF = (families) => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text('कुटुंब सर्वे - कुटुंब निहाय अहवाल', 105, 15, { align: 'center' });
  doc.setFontSize(12);
  doc.text('Family-wise Survey Report', 105, 22, { align: 'center' });

  let yPos = 35;

  families.forEach((family, familyIndex) => {
    // Check if we need a new page
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }

    // Family header
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.setFillColor(255, 215, 0);
    doc.rect(14, yPos - 5, 182, 8, 'F');
    doc.text(`Family ${family.family_id} (${family.total_members} members)`, 16, yPos);
    yPos += 10;

    // Family members table
    const tableData = family.members.map((member, index) => [
      index + 1,
      member.name,
      member.age,
      member.gender,
      member.relation,
      new Date(member.dob).toLocaleDateString('en-IN')
    ]);

    doc.autoTable({
      head: [['#', 'Name', 'Age', 'Gender', 'Relation', 'DOB']],
      body: tableData,
      startY: yPos,
      theme: 'striped',
      headStyles: {
        fillColor: [50, 50, 50],
        textColor: [255, 255, 255],
        fontSize: 9,
      },
      bodyStyles: {
        fontSize: 8,
      },
      margin: { left: 20, right: 20 },
    });

    yPos = doc.lastAutoTable.finalY + 10;
  });

  // Footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(9);
    doc.setTextColor(128, 128, 128);
    doc.text(
      `Page ${i} of ${pageCount}`,
      doc.internal.pageSize.width / 2,
      doc.internal.pageSize.height - 10,
      { align: 'center' }
    );
  }

  const fileName = `family_wise_report_${new Date().getTime()}.pdf`;
  doc.save(fileName);
};

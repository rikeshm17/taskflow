import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import type { Task } from "../types/task";

export function exportToPDF(tasks: Task[]) {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("TaskFlow Task Report", 14, 20);

  autoTable(doc, {
    head: [["Title", "Priority", "Category", "Status", "Due Date"]],
    body: tasks.map(task => [
      task.title,
      task.priority,
      task.category,
      task.completed ? "Completed" : "Pending",
      task.due_date || "-"
    ]),
    startY: 30,
  });

  doc.save("TaskFlow_Report.pdf");
}

export function exportToExcel(tasks: Task[]) {
  const worksheet = XLSX.utils.json_to_sheet(
    tasks.map(task => ({
      Title: task.title,
      Description: task.description,
      Priority: task.priority,
      Category: task.category,
      Status: task.completed ? "Completed" : "Pending",
      DueDate: task.due_date,
    }))
  );

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Tasks");

  XLSX.writeFile(workbook, "TaskFlow_Report.xlsx");
}

export function exportToCSV(tasks: Task[]) {
  const worksheet = XLSX.utils.json_to_sheet(tasks);

  const csv = XLSX.utils.sheet_to_csv(worksheet);

  const blob = new Blob([csv], {
    type: "text/csv;charset=utf-8;",
  });

  saveAs(blob, "TaskFlow_Report.csv");
}
using DocumentFormat.OpenXml;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Spreadsheet;
using Microsoft.AspNetCore.Mvc;
using PressureMeasurementApp.API.Data.Dto;
using PressureMeasurementApp.API.Interfaces;


namespace PressureMeasurementApp.API.Services
{
    public class MeasurementsParseToFile : IParseToFile<PressureMeasurementToFile>
    {
        public async Task<FileContentResult> PraseToXlsx(IEnumerable<PressureMeasurementToFile> entities)
        {
            try
            {
                var measurements = entities.Select((measurement, i) => new
                {
                    Index = i + 1,
                    measurement.PressureAllStats,
                    measurement.Description,
                    measurement.Smoking,
                    measurement.Alcohol,
                    measurement.Sport,
                    measurement.Stretching,
                    measurement.PressureStateName,
                    measurement.MeasureDate
                });

                string title = $"Pressure measurement report generated: {DateTime.Now.ToString("dd.MM.yy, HH:mm:ss")}";

                using var memoryStream = new MemoryStream();

                await Task.Run(() =>
                {
                    using (var spreadsheetDocument = SpreadsheetDocument.Create(memoryStream, SpreadsheetDocumentType.Workbook))
                    {
                        var workbookPart = spreadsheetDocument.AddWorkbookPart();
                        workbookPart.Workbook = new Workbook();

                        var sheets = spreadsheetDocument.WorkbookPart.Workbook.AppendChild(new Sheets());

                        var sheet = CreateSheet(spreadsheetDocument, "Pressure measurements", title,
                            new string[] {
                                "Number","Pressure stats", "Description", "Smoking?", "Alcohol?","Sport?", "Stretching?","Status","Date of measurement" },
                            measurements);

                        sheets.Append(sheet);

                        workbookPart.Workbook.Save();
                    }
                });

                return new FileContentResult(memoryStream.ToArray(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
                {
                    FileDownloadName = "report.xlsx"
                };
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error while generating Excel report", ex);
            }
        }

        private Sheet CreateSheet(SpreadsheetDocument document, string sheetName, string title, string[] columnHeaders, object data)
        {
            try
            {
                var sheetPart = document.WorkbookPart.AddNewPart<WorksheetPart>();
                var sheetData = new SheetData();
                sheetPart.Worksheet = new Worksheet(sheetData);

                var sheets = document.WorkbookPart.Workbook.GetFirstChild<Sheets>();
                var sheetId = sheets.Elements<Sheet>().Count() + 1;
                var sheet = new Sheet()
                {
                    Id = document.WorkbookPart.GetIdOfPart(sheetPart),
                    SheetId = (uint)sheetId,
                    Name = sheetName
                };

                var titleRow = new Row();
                titleRow.Append(new Cell()
                {
                    CellValue = new CellValue(title),
                    DataType = CellValues.String
                });
                sheetData.Append(titleRow);

                var headerRow = new Row();
                foreach (var header in columnHeaders)
                {
                    headerRow.Append(new Cell()
                    {
                        CellValue = new CellValue(header),
                        DataType = CellValues.String
                    });
                }
                sheetData.Append(headerRow);

                foreach (var item in (dynamic)data)
                {
                    var dataRow = new Row();
                    foreach (var prop in item.GetType().GetProperties())
                    {
                        dataRow.Append(new Cell()
                        {
                            CellValue = new CellValue(prop.GetValue(item)?.ToString()),
                            DataType = CellValues.String
                        });
                    }
                    sheetData.Append(dataRow);
                }

                return sheet;
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error while creating Excel sheet", ex);
            }
        }
    }
}
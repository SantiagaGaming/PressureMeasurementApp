using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace PressureMeasurementApp.API.Migrations
{
    /// <inheritdoc />
    public partial class initial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase()
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "PressureStates",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PressureStates", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "PressureMeasurements",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    UpperPressure = table.Column<int>(type: "int", nullable: false),
                    LowerPressure = table.Column<int>(type: "int", nullable: false),
                    Heartbeat = table.Column<int>(type: "int", nullable: false),
                    MeasureDate = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    Description = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Smoking = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    Alcohol = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    Sport = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    Stretching = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    PressureStateId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PressureMeasurements", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PressureMeasurements_PressureStates_PressureStateId",
                        column: x => x.PressureStateId,
                        principalTable: "PressureStates",
                        principalColumn: "Id");
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.InsertData(
                table: "PressureStates",
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { 1, "Low" },
                    { 2, "Normal" },
                    { 3, "High" },
                    { 4, "Very high" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_PressureMeasurements_PressureStateId",
                table: "PressureMeasurements",
                column: "PressureStateId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PressureMeasurements");

            migrationBuilder.DropTable(
                name: "PressureStates");
        }
    }
}

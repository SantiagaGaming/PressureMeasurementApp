using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PressureMeasurementApp.API.Migrations
{
    /// <inheritdoc />
    public partial class UserIdAdded : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "UserId",
                table: "PressureMeasurements",
                type: "int",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UserId",
                table: "PressureMeasurements");
        }
    }
}

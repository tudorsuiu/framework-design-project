using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SmartService.Domain.Migrations
{
    /// <inheritdoc />
    public partial class CascadeDeleteReparationWhenDeleteCar : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Reparations_Cars_CarId",
                table: "Reparations");

            migrationBuilder.AddForeignKey(
                name: "FK_Reparations_Cars_CarId",
                table: "Reparations",
                column: "CarId",
                principalTable: "Cars",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Reparations_Cars_CarId",
                table: "Reparations");

            migrationBuilder.AddForeignKey(
                name: "FK_Reparations_Cars_CarId",
                table: "Reparations",
                column: "CarId",
                principalTable: "Cars",
                principalColumn: "Id");
        }
    }
}

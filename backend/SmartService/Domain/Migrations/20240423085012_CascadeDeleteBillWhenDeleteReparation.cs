using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SmartService.Domain.Migrations
{
    /// <inheritdoc />
    public partial class CascadeDeleteBillWhenDeleteReparation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Bills_Reparations_ReparationId",
                table: "Bills");

            migrationBuilder.AddForeignKey(
                name: "FK_Bills_Reparations_ReparationId",
                table: "Bills",
                column: "ReparationId",
                principalTable: "Reparations",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Bills_Reparations_ReparationId",
                table: "Bills");

            migrationBuilder.AddForeignKey(
                name: "FK_Bills_Reparations_ReparationId",
                table: "Bills",
                column: "ReparationId",
                principalTable: "Reparations",
                principalColumn: "Id");
        }
    }
}

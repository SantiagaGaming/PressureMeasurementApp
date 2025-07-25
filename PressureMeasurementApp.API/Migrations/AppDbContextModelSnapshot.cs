﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using PressureMeasurementApp.API.Infrastructure.Context;

#nullable disable

namespace PressureMeasurementApp.API.Migrations
{
    [DbContext(typeof(AppDbContext))]
    partial class AppDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.16")
                .HasAnnotation("Relational:MaxIdentifierLength", 64);

            MySqlModelBuilderExtensions.AutoIncrementColumns(modelBuilder);

            modelBuilder.Entity("PressureMeasurementApp.API.Data.Entitites.PressureMeasurement", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    MySqlPropertyBuilderExtensions.UseMySqlIdentityColumn(b.Property<int>("Id"));

                    b.Property<bool>("Alcohol")
                        .HasColumnType("tinyint(1)");

                    b.Property<string>("Description")
                        .HasColumnType("longtext");

                    b.Property<int>("Heartbeat")
                        .HasColumnType("int");

                    b.Property<int>("LowerPressure")
                        .HasColumnType("int");

                    b.Property<DateTime>("MeasureDate")
                        .HasColumnType("datetime(6)");

                    b.Property<int?>("PressureStateId")
                        .HasColumnType("int");

                    b.Property<bool>("Smoking")
                        .HasColumnType("tinyint(1)");

                    b.Property<bool>("Sport")
                        .HasColumnType("tinyint(1)");

                    b.Property<bool>("Stretching")
                        .HasColumnType("tinyint(1)");

                    b.Property<int>("UpperPressure")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("PressureStateId");

                    b.ToTable("PressureMeasurements");
                });

            modelBuilder.Entity("PressureMeasurementApp.API.Data.Entitites.PressureState", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    MySqlPropertyBuilderExtensions.UseMySqlIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("Name")
                        .HasColumnType("longtext");

                    b.HasKey("Id");

                    b.ToTable("PressureStates");

                    b.HasData(
                        new
                        {
                            Id = 1,
                            Name = "Low"
                        },
                        new
                        {
                            Id = 2,
                            Name = "Normal"
                        },
                        new
                        {
                            Id = 3,
                            Name = "High"
                        },
                        new
                        {
                            Id = 4,
                            Name = "Very high"
                        });
                });

            modelBuilder.Entity("PressureMeasurementApp.API.Data.Entitites.PressureMeasurement", b =>
                {
                    b.HasOne("PressureMeasurementApp.API.Data.Entitites.PressureState", "PressureState")
                        .WithMany()
                        .HasForeignKey("PressureStateId");

                    b.Navigation("PressureState");
                });
#pragma warning restore 612, 618
        }
    }
}

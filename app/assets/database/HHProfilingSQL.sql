-- MySQL Script generated by MySQL Workbench
-- Mon Feb 15 09:18:23 2021
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `mydb` ;

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `mydb` DEFAULT CHARACTER SET utf8 ;
SHOW WARNINGS;
USE `mydb` ;

-- -----------------------------------------------------
-- Table `lib_buildingtype`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `lib_buildingtype` ;

SHOW WARNINGS;
CREATE TABLE IF NOT EXISTS `lib_buildingtype` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `lib_buildingtypedesc` VARCHAR(45) NOT NULL,
  `created_at` VARCHAR(45) NOT NULL,
  `updated_at` VARCHAR(45) NOT NULL,
  `created_by` INT NOT NULL,
  `updated_by` INT NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;

SHOW WARNINGS;

-- -----------------------------------------------------
-- Table `lib_buildinguse`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `lib_buildinguse` ;

SHOW WARNINGS;
CREATE TABLE IF NOT EXISTS `lib_buildinguse` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `lib_buildingusedesc` VARCHAR(45) NOT NULL,
  `created_at` VARCHAR(45) NOT NULL,
  `updated_at` VARCHAR(45) NOT NULL,
  `created_by` INT NOT NULL,
  `updated_by` INT NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;

SHOW WARNINGS;

-- -----------------------------------------------------
-- Table `lib_disability`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `lib_disability` ;

SHOW WARNINGS;
CREATE TABLE IF NOT EXISTS `lib_disability` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `lib_dname` VARCHAR(45) NOT NULL,
  `created_at` VARCHAR(45) NOT NULL,
  `updated_at` VARCHAR(45) NOT NULL,
  `created_by` INT NOT NULL,
  `updated_by` INT NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;

SHOW WARNINGS;

-- -----------------------------------------------------
-- Table `lib_ethnicity`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `lib_ethnicity` ;

SHOW WARNINGS;
CREATE TABLE IF NOT EXISTS `lib_ethnicity` (
  `id` INT NOT NULL,
  `lib_ename` VARCHAR(45) NOT NULL,
  `created_at` VARCHAR(45) NOT NULL,
  `updated_at` VARCHAR(45) NOT NULL,
  `created_by` INT NOT NULL,
  `updated_by` INT NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;

SHOW WARNINGS;

-- -----------------------------------------------------
-- Table `lib_familybelongs`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `lib_familybelongs` ;

SHOW WARNINGS;
CREATE TABLE IF NOT EXISTS `lib_familybelongs` (
  `id` INT NOT NULL,
  `lib_fbname` VARCHAR(45) NOT NULL,
  `created_at` VARCHAR(45) NOT NULL,
  `updated_at` VARCHAR(45) NOT NULL,
  `created_by` VARCHAR(45) NOT NULL,
  `updated_by` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;

SHOW WARNINGS;

-- -----------------------------------------------------
-- Table `lib_gender`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `lib_gender` ;

SHOW WARNINGS;
CREATE TABLE IF NOT EXISTS `lib_gender` (
  `id` INT NOT NULL,
  `lib_gname` VARCHAR(45) NOT NULL,
  `created_at` VARCHAR(45) NOT NULL,
  `updated_at` VARCHAR(45) NOT NULL,
  `created_by` INT NOT NULL,
  `updated_by` INT NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;

SHOW WARNINGS;

-- -----------------------------------------------------
-- Table `lib_gradelvl`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `lib_gradelvl` ;

SHOW WARNINGS;
CREATE TABLE IF NOT EXISTS `lib_gradelvl` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `lib_glcode` VARCHAR(45) NULL,
  `lib_glname` VARCHAR(45) NOT NULL,
  `created_at` VARCHAR(45) NOT NULL,
  `updated_at` VARCHAR(45) NOT NULL,
  `created_by` INT NOT NULL,
  `updated_by` INT NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;

SHOW WARNINGS;

-- -----------------------------------------------------
-- Table `lib_hea`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `lib_hea` ;

SHOW WARNINGS;
CREATE TABLE IF NOT EXISTS `lib_hea` (
  `id` INT NOT NULL,
  `lib_heacode` VARCHAR(45) NOT NULL,
  `lib_heaname` VARCHAR(45) NOT NULL,
  `created_at` VARCHAR(45) NOT NULL,
  `updated_at` VARCHAR(45) NOT NULL,
  `created_by` INT NOT NULL,
  `updated_by` INT NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;

SHOW WARNINGS;

-- -----------------------------------------------------
-- Table `lib_hhlvlwatersystem`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `lib_hhlvlwatersystem` ;

SHOW WARNINGS;
CREATE TABLE IF NOT EXISTS `lib_hhlvlwatersystem` (
  `id` INT NOT NULL,
  `lib_hhwatersystemlvl` VARCHAR(45) NOT NULL,
  `lib_hhlvldesc` VARCHAR(45) NOT NULL,
  `created_at` VARCHAR(45) NOT NULL,
  `updated_at` VARCHAR(45) NOT NULL,
  `created_by` INT NOT NULL,
  `updated_by` INT NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;

SHOW WARNINGS;

-- -----------------------------------------------------
-- Table `lib_maritalstatus`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `lib_maritalstatus` ;

SHOW WARNINGS;
CREATE TABLE IF NOT EXISTS `lib_maritalstatus` (
  `id` INT NOT NULL,
  `lib_msname` VARCHAR(45) NOT NULL,
  `created_at` VARCHAR(45) NOT NULL,
  `updated_at` VARCHAR(45) NOT NULL,
  `created_by` INT NOT NULL,
  `updated_by` INT NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;

SHOW WARNINGS;

-- -----------------------------------------------------
-- Table `lib_monthlyincome`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `lib_monthlyincome` ;

SHOW WARNINGS;
CREATE TABLE IF NOT EXISTS `lib_monthlyincome` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `lib_miname` VARCHAR(45) NOT NULL,
  `created_at` VARCHAR(45) NOT NULL,
  `updated_at` VARCHAR(45) NOT NULL,
  `created_by` INT NOT NULL,
  `updated_by` INT NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;

SHOW WARNINGS;

-- -----------------------------------------------------
-- Table `lib_nutritioanalstatus`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `lib_nutritioanalstatus` ;

SHOW WARNINGS;
CREATE TABLE IF NOT EXISTS `lib_nutritioanalstatus` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `lib_nsname` VARCHAR(45) NOT NULL,
  `lib_daterecorded` VARCHAR(45) NOT NULL,
  `created_at` VARCHAR(45) NOT NULL,
  `updated_at` VARCHAR(45) NOT NULL,
  `created_by` INT NOT NULL,
  `updated_by` INT NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;

SHOW WARNINGS;

-- -----------------------------------------------------
-- Table `lib_relationshiphead`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `lib_relationshiphead` ;

SHOW WARNINGS;
CREATE TABLE IF NOT EXISTS `lib_relationshiphead` (
  `id` INT NOT NULL,
  `lib_rhname` VARCHAR(45) NOT NULL,
  `created_at` VARCHAR(45) NULL,
  `updated_at` VARCHAR(45) NULL,
  `created_by` INT NULL,
  `updated_by` INT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;

SHOW WARNINGS;

-- -----------------------------------------------------
-- Table `lib_religion`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `lib_religion` ;

SHOW WARNINGS;
CREATE TABLE IF NOT EXISTS `lib_religion` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `lib_rname` VARCHAR(45) NOT NULL,
  `created_at` VARCHAR(45) NOT NULL,
  `updated_at` VARCHAR(45) NOT NULL,
  `created_by` INT NOT NULL,
  `updated_by` INT NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;

SHOW WARNINGS;

-- -----------------------------------------------------
-- Table `lib_roofmaterials`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `lib_roofmaterials` ;

SHOW WARNINGS;
CREATE TABLE IF NOT EXISTS `lib_roofmaterials` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `lib_roofmaterialsdesc` VARCHAR(45) NOT NULL,
  `created_at` VARCHAR(45) NOT NULL,
  `updated_at` VARCHAR(45) NOT NULL,
  `created_by` INT NOT NULL,
  `updated_by` INT NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;

SHOW WARNINGS;

-- -----------------------------------------------------
-- Table `lib_tenuralstatus`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `lib_tenuralstatus` ;

SHOW WARNINGS;
CREATE TABLE IF NOT EXISTS `lib_tenuralstatus` (
  `id` INT NOT NULL,
  `lib_tenuralstatusdesc` VARCHAR(45) NOT NULL,
  `created_at` VARCHAR(45) NOT NULL,
  `updated_at` VARCHAR(45) NOT NULL,
  `created_by` INT NOT NULL,
  `updated_by` INT NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;

SHOW WARNINGS;

-- -----------------------------------------------------
-- Table `lib_tscshvc`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `lib_tscshvc` ;

SHOW WARNINGS;
CREATE TABLE IF NOT EXISTS `lib_tscshvc` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `lib_tscshvcname` VARCHAR(45) NOT NULL,
  `created_at` VARCHAR(45) NOT NULL,
  `updated_at` VARCHAR(45) NOT NULL,
  `created_by` INT NOT NULL,
  `updated_by` INT NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;

SHOW WARNINGS;

-- -----------------------------------------------------
-- Table `lib_typeofbuilding`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `lib_typeofbuilding` ;

SHOW WARNINGS;
CREATE TABLE IF NOT EXISTS `lib_typeofbuilding` (
  `id` INT NOT NULL,
  `lib_tobname` VARCHAR(45) NOT NULL,
  `created_at` VARCHAR(45) NOT NULL,
  `updated_at` VARCHAR(45) NOT NULL,
  `created_by` INT NOT NULL,
  `updated_by` INT NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;

SHOW WARNINGS;
CREATE UNIQUE INDEX `idlib_typeofbuilding_UNIQUE` ON `lib_typeofbuilding` (`id` ASC) VISIBLE;

SHOW WARNINGS;

-- -----------------------------------------------------
-- Table `lib_typeofprogram`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `lib_typeofprogram` ;

SHOW WARNINGS;
CREATE TABLE IF NOT EXISTS `lib_typeofprogram` (
  `id` INT NOT NULL,
  `lib_topname` VARCHAR(45) NOT NULL,
  `created_at` VARCHAR(45) NOT NULL,
  `updated_at` VARCHAR(45) NOT NULL,
  `created_by` VARCHAR(45) NOT NULL,
  `updated_by` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;

SHOW WARNINGS;

-- -----------------------------------------------------
-- Table `lib_wallconmaterials`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `lib_wallconmaterials` ;

SHOW WARNINGS;
CREATE TABLE IF NOT EXISTS `lib_wallconmaterials` (
  `id` INT NOT NULL,
  `tbl_tocmname` VARCHAR(45) NULL,
  `created_at` VARCHAR(45) NOT NULL,
  `updated_at` VARCHAR(45) NOT NULL,
  `created_by` INT NOT NULL,
  `updated_by` INT NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;

SHOW WARNINGS;
CREATE UNIQUE INDEX `idtbl_typeofconmaterials_UNIQUE` ON `lib_wallconmaterials` (`id` ASC) VISIBLE;

SHOW WARNINGS;
CREATE UNIQUE INDEX `tbl_tocmname_UNIQUE` ON `lib_wallconmaterials` (`tbl_tocmname` ASC) VISIBLE;

SHOW WARNINGS;

-- -----------------------------------------------------
-- Table `lib_wallmaterials`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `lib_wallmaterials` ;

SHOW WARNINGS;
CREATE TABLE IF NOT EXISTS `lib_wallmaterials` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `lib_wallmaterialsdesc` VARCHAR(45) NOT NULL,
  `created_at` VARCHAR(45) NOT NULL,
  `updated_at` VARCHAR(45) NOT NULL,
  `created_by` INT NOT NULL,
  `updated_by` INT NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;

SHOW WARNINGS;

-- -----------------------------------------------------
-- Table `lib_watertenuralstatus`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `lib_watertenuralstatus` ;

SHOW WARNINGS;
CREATE TABLE IF NOT EXISTS `lib_watertenuralstatus` (
  `id` INT NOT NULL,
  `lib_wtdesc` VARCHAR(45) NOT NULL,
  `created_at` VARCHAR(45) NOT NULL,
  `updated_at` VARCHAR(45) NOT NULL,
  `created_by` INT NOT NULL,
  `updated_by` INT NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;

SHOW WARNINGS;

-- -----------------------------------------------------
-- Table `libl_psgc_brgy`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `libl_psgc_brgy` ;

SHOW WARNINGS;
CREATE TABLE IF NOT EXISTS `libl_psgc_brgy` (
  `id` INT NOT NULL,
  `tbl_psgc_brgyname` VARCHAR(45) NOT NULL,
  `tbl_psgc_mun_id_fk` INT NOT NULL,
  PRIMARY KEY (`id`, `tbl_psgc_mun_id_fk`))
ENGINE = InnoDB;

SHOW WARNINGS;

-- -----------------------------------------------------
-- Table `libl_psgc_mun`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `libl_psgc_mun` ;

SHOW WARNINGS;
CREATE TABLE IF NOT EXISTS `libl_psgc_mun` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `tbl_psgc_munname` VARCHAR(45) NOT NULL,
  `tbl_psgc_prov_id_fk` INT NOT NULL,
  PRIMARY KEY (`id`, `tbl_psgc_prov_id_fk`))
ENGINE = InnoDB;

SHOW WARNINGS;

-- -----------------------------------------------------
-- Table `libl_psgc_prov`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `libl_psgc_prov` ;

SHOW WARNINGS;
CREATE TABLE IF NOT EXISTS `libl_psgc_prov` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `tbl_psgc_provname` VARCHAR(45) NOT NULL,
  `tbl_psgc_region_id_fk` INT NOT NULL,
  PRIMARY KEY (`id`, `tbl_psgc_region_id_fk`))
ENGINE = InnoDB;

SHOW WARNINGS;

-- -----------------------------------------------------
-- Table `libl_psgc_region`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `libl_psgc_region` ;

SHOW WARNINGS;
CREATE TABLE IF NOT EXISTS `libl_psgc_region` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `tbl_psgc_regionname` VARCHAR(45) NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;

SHOW WARNINGS;

-- -----------------------------------------------------
-- Table `libl_roofconmaterials`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `libl_roofconmaterials` ;

SHOW WARNINGS;
CREATE TABLE IF NOT EXISTS `libl_roofconmaterials` (
  `id` INT NOT NULL,
  `tbl_tocmname` VARCHAR(45) NULL,
  `created_at` VARCHAR(45) NOT NULL,
  `updated_at` VARCHAR(45) NOT NULL,
  `created_by` INT NOT NULL,
  `updated_by` INT NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;

SHOW WARNINGS;
CREATE UNIQUE INDEX `idtbl_typeofconmaterials_UNIQUE` ON `libl_roofconmaterials` (`id` ASC) VISIBLE;

SHOW WARNINGS;
CREATE UNIQUE INDEX `tbl_tocmname_UNIQUE` ON `libl_roofconmaterials` (`tbl_tocmname` ASC) VISIBLE;

SHOW WARNINGS;

-- -----------------------------------------------------
-- Table `libl_tenuralstatus`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `libl_tenuralstatus` ;

SHOW WARNINGS;
CREATE TABLE IF NOT EXISTS `libl_tenuralstatus` (
  `id` INT NOT NULL,
  `tbl_tsname` VARCHAR(45) NOT NULL,
  `created_at` VARCHAR(45) NOT NULL,
  `updated_at` VARCHAR(45) NOT NULL,
  `created_by` INT NOT NULL,
  `updated_by` INT NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;

SHOW WARNINGS;
CREATE UNIQUE INDEX `idtbl_tenuralstatus_UNIQUE` ON `libl_tenuralstatus` (`id` ASC) VISIBLE;

SHOW WARNINGS;

-- -----------------------------------------------------
-- Table `tbl_addOtherEvacuation`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `tbl_addOtherEvacuation` ;

SHOW WARNINGS;
CREATE TABLE IF NOT EXISTS `tbl_addOtherEvacuation` (
  `id` INT NOT NULL,
  `tbl_addOtherEvacuationlocation` VARCHAR(45) NOT NULL,
  `created_at` VARCHAR(45) NULL,
  `created_by` INT NULL,
  `updated_at` VARCHAR(45) NULL,
  `updated_by` INT NULL,
  `tbl_household_id` INT NOT NULL,
  PRIMARY KEY (`id`, `tbl_household_id`))
ENGINE = InnoDB;

SHOW WARNINGS;
CREATE UNIQUE INDEX `id_UNIQUE` ON `tbl_addOtherEvacuation` (`id` ASC) VISIBLE;

SHOW WARNINGS;

-- -----------------------------------------------------
-- Table `tbl_enumerator`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `tbl_enumerator` ;

SHOW WARNINGS;
CREATE TABLE IF NOT EXISTS `tbl_enumerator` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `tbl_enumeratorfname` VARCHAR(45) NOT NULL,
  `tbl_enumeratorlname` VARCHAR(45) NOT NULL,
  `tbl_enumeratormname` VARCHAR(45) NULL,
  `tbl_enumeratorcontact` VARCHAR(45) NOT NULL,
  `tbl_enumeratoremaill` VARCHAR(45) NOT NULL,
  `tbl_enumeratorpassword` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;

SHOW WARNINGS;

-- -----------------------------------------------------
-- Table `tbl_evacuation_areas`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `tbl_evacuation_areas` ;

SHOW WARNINGS;
CREATE TABLE IF NOT EXISTS `tbl_evacuation_areas` (
  `id` INT NOT NULL,
  `tbl_located_at` VARCHAR(45) NOT NULL,
  `created_at` VARCHAR(45) NOT NULL,
  `updated_at` VARCHAR(45) NOT NULL,
  `created_by` VARCHAR(45) NOT NULL,
  `updated_by` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;

SHOW WARNINGS;

-- -----------------------------------------------------
-- Table `tbl_evacuationcalamity`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `tbl_evacuationcalamity` ;

SHOW WARNINGS;
CREATE TABLE IF NOT EXISTS `tbl_evacuationcalamity` (
  `id` INT NOT NULL,
  `tbl_household_id` INT NOT NULL,
  `tbl_eocyear` VARCHAR(45) NOT NULL,
  `created_at` VARCHAR(45) NOT NULL,
  `updated_at` VARCHAR(45) NOT NULL,
  `created_by` VARCHAR(45) NOT NULL,
  `updated_by` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;

SHOW WARNINGS;

-- -----------------------------------------------------
-- Table `tbl_floodevent`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `tbl_floodevent` ;

SHOW WARNINGS;
CREATE TABLE IF NOT EXISTS `tbl_floodevent` (
  `id` INT NOT NULL,
  `tbl_household_id` INT NOT NULL,
  `tbl_eventyear` VARCHAR(45) NOT NULL,
  `created_at` VARCHAR(45) NOT NULL,
  `updated_at` VARCHAR(45) NOT NULL,
  `created_by` INT NOT NULL,
  `updated_by` INT NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;

SHOW WARNINGS;

-- -----------------------------------------------------
-- Table `tbl_healthsanitation`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `tbl_healthsanitation` ;

SHOW WARNINGS;
CREATE TABLE IF NOT EXISTS `tbl_healthsanitation` (
  `id` INT NOT NULL,
  `tbl_household_id` INT NOT NULL,
  `tbl_hsmedtreatillness` VARCHAR(45) NOT NULL,
  `created_at` VARCHAR(45) NOT NULL,
  `updated_at` VARCHAR(45) NOT NULL,
  `created_by` INT NOT NULL,
  `updated_by` INT NOT NULL,
  PRIMARY KEY (`id`, `tbl_household_id`))
ENGINE = InnoDB;

SHOW WARNINGS;
CREATE UNIQUE INDEX `idtbl_healthsanitation_UNIQUE` ON `tbl_healthsanitation` (`id` ASC) VISIBLE;

SHOW WARNINGS;

-- -----------------------------------------------------
-- Table `tbl_hhdemography`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `tbl_hhdemography` ;

SHOW WARNINGS;
CREATE TABLE IF NOT EXISTS `tbl_hhdemography` (
  `id` INT NOT NULL,
  `tbl_household_id` INT NOT NULL,
  `tbl_fname` VARCHAR(45) NOT NULL,
  `tbl_lname` VARCHAR(45) NOT NULL,
  `tbl_mname` VARCHAR(45) NOT NULL,
  `tbl_extension` VARCHAR(45) NOT NULL,
  `lib_familybelongs_id` INT NOT NULL,
  `lib_gender_id` INT NOT NULL,
  `tbl_relationshiphead_id` INT NOT NULL,
  `tbl_datebirth` DATE NOT NULL,
  `lib_maritalstatus_id` INT NOT NULL,
  `lib_ethnicity_id` INT NOT NULL,
  `lib_religion_id` INT NOT NULL,
  `lib_disability_id` INT NOT NULL,
  `tbl_isofw` TINYINT NOT NULL,
  `tbl_is3yrsinlocation` TINYINT NOT NULL,
  `lib_nutritioanalstatus_id` INT NOT NULL,
  `tbl_iscurattschool` TINYINT NOT NULL,
  `lib_gradelvl_id` INT NOT NULL,
  `tbl_canreadwriteorhighschoolgrade` TINYINT NOT NULL,
  `tbl_primary_occupation` VARCHAR(45) NULL,
  `lib_hea_id` INT NOT NULL,
  `lib_tscshvc_id` INT NOT NULL,
  `lib_monthlyincome_id` INT NOT NULL,
  `tbl_ismembersss` TINYINT NOT NULL,
  `tbl_ismembergsis` TINYINT NOT NULL,
  `tbl_ismemberphilhealth` TINYINT NOT NULL,
  `created_at` VARCHAR(45) NOT NULL,
  `updated_at` VARCHAR(45) NOT NULL,
  `created_by` INT NOT NULL,
  `updated_by` INT NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;

SHOW WARNINGS;

-- -----------------------------------------------------
-- Table `tbl_household`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `tbl_household` ;

SHOW WARNINGS;
CREATE TABLE IF NOT EXISTS `tbl_household` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `tbl_hhimage` VARCHAR(45) NOT NULL,
  `tbl_hhissethead` TINYINT NOT NULL,
  `tbl_hhcontrolnumber` VARCHAR(45) NULL,
  `tbl_hhdateinterview` VARCHAR(45) NOT NULL,
  `tbl_hhlatitude` VARCHAR(45) NOT NULL,
  `tbl_hhlongitude` VARCHAR(45) NOT NULL,
  `tbl_hhfield_editor` VARCHAR(45) NULL,
  `tbl_hhyearconstruct` VARCHAR(45) NOT NULL,
  `tbl_hhecost` INT NOT NULL,
  `tbl_hhnobedroms` INT NOT NULL,
  `tbl_hhnostorey` INT NOT NULL,
  `tbl_hhaelectricity` TINYINT NOT NULL,
  `tbl_hhainternet` TINYINT NOT NULL,
  `tbl_householdpuroksittio` VARCHAR(45) NOT NULL,
  `tbl_psgc_brgy_id` INT NOT NULL,
  `lib_typeofbuilding_id` INT NOT NULL,
  `tbl_tenuralstatus_id` INT NOT NULL,
  `tbl_typeofconmaterials_id` INT NOT NULL,
  `tbl_wallconmaterials_id` INT NOT NULL,
  `tbl_hhaccesswater` TINYINT NULL,
  `tbl_hhwaterpotable` TINYINT NULL,
  `tbl_watertenuralstatus_id` INT NOT NULL,
  `tbl_hhlvlwatersystem_id` INT NOT NULL,
  `tbl_evacuation_areas_id` INT NOT NULL,
  `tbl_hhhasaccesshealtmedicalfacility` TINYINT NOT NULL,
  `tbl_hhhasaccesstelecom` TINYINT NOT NULL,
  `tbl_hasaccessdrillsandsimulations` TINYINT NOT NULL,
  `created_at` VARCHAR(45) NOT NULL,
  `updated_at` VARCHAR(45) NOT NULL,
  `created_by` INT NOT NULL,
  `updatedy_by` INT NOT NULL,
  `tbl_enumerator_id` INT NOT NULL,
  PRIMARY KEY (`id`, `tbl_enumerator_id`))
ENGINE = InnoDB;

SHOW WARNINGS;

-- -----------------------------------------------------
-- Table `tbl_livelihood`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `tbl_livelihood` ;

SHOW WARNINGS;
CREATE TABLE IF NOT EXISTS `tbl_livelihood` (
  `id` INT NOT NULL,
  `tbl_household_id` INT NOT NULL,
  `tbl_livelihoodmarketvalue` INT NOT NULL,
  `tbl_livelihoodnetincome` INT NOT NULL,
  `tbl_livelihoodtotalarea` INT NOT NULL,
  `tbl_livelihoodproducts` VARCHAR(45) NOT NULL,
  `lib_tenuralstatus_id` INT NOT NULL,
  `tbl_livelihoodiswithinsurance` TINYINT NOT NULL,
  `created_at` VARCHAR(45) NOT NULL,
  `updated_at` VARCHAR(45) NOT NULL,
  `created_by` INT NOT NULL,
  `updated_by` INT NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;

SHOW WARNINGS;

-- -----------------------------------------------------
-- Table `tbl_otherproperty`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `tbl_otherproperty` ;

SHOW WARNINGS;
CREATE TABLE IF NOT EXISTS `tbl_otherproperty` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `tbl_hhdemography_id` INT NOT NULL,
  `lib_buildingtype_id` INT NOT NULL,
  `lib_buildinguse_id` INT NOT NULL,
  `lib_wallmaterials_id` INT NOT NULL,
  `lib_roofmaterials_id` INT NOT NULL,
  `tbl_otherpropertynostorey` INT NOT NULL,
  `tbl_otherpropertyhaselectricity` TINYINT NOT NULL,
  `tbl_otherpropertyhasinternet` TINYINT NOT NULL,
  `tbl_otherpropertycost` INT NOT NULL,
  `tbl_otherpropertydateconstruct` DATE NOT NULL,
  `created_at` VARCHAR(45) NOT NULL,
  `updated_at` VARCHAR(45) NOT NULL,
  `created_by` INT NOT NULL,
  `updated_by` INT NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;

SHOW WARNINGS;

-- -----------------------------------------------------
-- Table `tbl_programs`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `tbl_programs` ;

SHOW WARNINGS;
CREATE TABLE IF NOT EXISTS `tbl_programs` (
  `id` INT NOT NULL,
  `tbl_household_id` INT NOT NULL,
  `lib_typeofprogram_id` INT NOT NULL,
  `lib_pname` VARCHAR(45) NOT NULL,
  `lib_pnumbeni` INT NOT NULL,
  `lib_pimplementor` VARCHAR(45) NOT NULL,
  `created_at` VARCHAR(45) NOT NULL,
  `updated_at` VARCHAR(45) NOT NULL,
  `created_by` INT NOT NULL,
  `updated_by` INT NOT NULL,
  PRIMARY KEY (`id`, `tbl_household_id`, `lib_typeofprogram_id`))
ENGINE = InnoDB;

SHOW WARNINGS;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
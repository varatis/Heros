-- ================================================================
-- HeroBook - Migration 011 : nouvel effet 'inventory_remove'
-- ---------------------------------------------------------------
-- Ajoute la valeur 'inventory_remove' à l'enum choice_effect_type.
-- Isolée dans sa propre migration : PostgreSQL interdit d'utiliser
-- une valeur d'enum fraîchement créée dans la même transaction.
-- Utilisée par la migration 012 (achats en Couronnes, repas...).
-- ================================================================
ALTER TYPE choice_effect_type ADD VALUE IF NOT EXISTS 'inventory_remove';

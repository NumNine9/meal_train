-- ============================================================================
-- Meal Train SA — Missing Slot Policies
-- Migration: 0003_slot_policies
-- Description: Add INSERT/UPDATE/DELETE policies for meal_slots
-- ============================================================================

-- Organizers can create slots for their own trains
CREATE POLICY "Organizers can insert slots for own trains"
  ON meal_slots FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM meal_trains
      WHERE meal_trains.id = meal_slots.meal_train_id
        AND meal_trains.organizer_id = auth.uid()
    )
  );

-- Organizers can update slots of their own trains
-- (e.g. mark as delivered, edit volunteer notes, cancel a slot)
CREATE POLICY "Organizers can update slots of own trains"
  ON meal_slots FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM meal_trains
      WHERE meal_trains.id = meal_slots.meal_train_id
        AND meal_trains.organizer_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM meal_trains
      WHERE meal_trains.id = meal_slots.meal_train_id
        AND meal_trains.organizer_id = auth.uid()
    )
  );

-- Organizers can delete slots of their own trains
-- (e.g. when cancelling a train)
CREATE POLICY "Organizers can delete slots of own trains"
  ON meal_slots FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM meal_trains
      WHERE meal_trains.id = meal_slots.meal_train_id
        AND meal_trains.organizer_id = auth.uid()
    )
  );
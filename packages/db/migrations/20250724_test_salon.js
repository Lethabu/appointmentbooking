exports.up = async (pgm) => {
  await pgm.db.query(`
    INSERT INTO salons (id, name, owner_id)
    VALUES ('test-salon-id', 'Test Salon', 'test-user-id')
    ON CONFLICT (id) DO NOTHING
  `)
}

exports.down = async (pgm) => {
  await pgm.db.query("DELETE FROM salons WHERE id = 'test-salon-id'")
}
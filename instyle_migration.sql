DO $$
DECLARE
  v_salon_id UUID := 'ccb12b4d-ade6-467d-a614-7c9d198ddc70';
  v_user_id UUID;
BEGIN
  -- Find a valid user ID
  SELECT id INTO v_user_id FROM auth.users LIMIT 1;

  -- Clean up existing data for this salon, its profiles, services, and products to ensure a fresh insert
  DELETE FROM profiles WHERE salon_id = v_salon_id;
  DELETE FROM services WHERE salon_id = v_salon_id;
  DELETE FROM service_categories WHERE salon_id = v_salon_id;
  DELETE FROM products WHERE salon_id = v_salon_id;
  DELETE FROM salons WHERE id = v_salon_id;

  -- Insert the salon first with a valid user ID
  INSERT INTO salons (id, name, subdomain, owner_id, plan)
  VALUES (v_salon_id, 'InStyle Hair Boutique', 'instylehairboutique', v_user_id, 'elite');

  -- Upsert categories
  INSERT INTO service_categories (salon_id, name, sort_order) VALUES
  (v_salon_id, 'Installation', 1),
  (v_salon_id, 'Colour', 2),
  (v_salon_id, 'Styling', 3),
  (v_salon_id, 'Treatment', 4)
  ON CONFLICT DO NOTHING;

  -- Upsert services
  INSERT INTO services (salon_id, category_id, name, description, price_cents, duration_minutes, is_active)
  SELECT v_salon_id, sc.id, s.name, s.description, s.price, s.duration, true
  FROM (VALUES
    ('Middle & Side Installation', 'Professional middle-part weave', 5000, 60),
    ('Maphondo & Lines Installation', 'Intricate Maphondo braids', 5000, 60),
    ('Full Head Foils', 'Complete colour transformation', 12000, 180),
    ('Brazilian Blowout', 'Keratin smoothing treatment', 15000, 180),
    ('Hair Treatment', 'Rejuvenating mask & shine', 2500, 45)
  ) AS s(name, description, price, duration)
  JOIN service_categories sc ON sc.name = 'Installation' AND sc.salon_id = v_salon_id
  ON CONFLICT DO NOTHING;

  -- Upsert products
  -- Corrected products insert for your DO block
INSERT INTO products (salon_id, name, description, price, stock_quantity)
VALUES
  (v_salon_id, 'Lace Frontal Wig 16"', 'High-quality human hair', 350000, 10),
  (v_salon_id, 'Argan Oil Serum', 'Frizz-control serum', 28000, 50)
ON CONFLICT DO NOTHING;
  -- Seed staff account (for dashboard login)
  INSERT INTO profiles (salon_id, full_name, email, phone, role, staff)
VALUES
(v_salon_id, 'Zanele Langa (Owner)', 'zanele@instyle.co.za', '0647696159', 'admin', true)
ON CONFLICT DO NOTHING;

  -- Insert client profiles (from previous script, ensure no duplicates)
  INSERT INTO profiles (salon_id, full_name, email, phone, address, role) VALUES 
  (v_salon_id, 'Olerato', 'aobakwe.modise@icloud.com', 'Modise', '4582 Block B Mabopane Pretoria 0190', 'client'),
  (v_salon_id, 'Lethabo', 'booysenlethabo@icloud.com', '0691524569', 'Soshanguve, block L', 'client'),
  (v_salon_id, 'Kopano Selepe', 'faithselepe333@gmail.com', '081 546 8520', '827 Marothodi streets block k soshanguve', 'client'),
  (v_salon_id, 'motlalethabo Gloria', 'hlomotlalethabo@gmail.com', '0660178779', '906 dithabaneng street K Soshanguve 0152', 'client'),
  (v_salon_id, 'sinethmba Queen maphanga', 'indoniswati@gmail.com', '+27764492790', '890 block BB Soshanguve', 'client'),
  (v_salon_id, 'Oratilwe Kamogelo', 'kamogelooratilwe03@gmail.com', '0614144983', '8022 Nakedi Street Mabopane', 'client'),
  (v_salon_id, 'Karabelo Motaung', 'karabelolbmotaung02@gmail.com', '+27665972425', '6609 Dithabaneng soshanguve block K', 'client'),
  (v_salon_id, 'catherine', 'katarinacatherine11@gmail.com', '+27608172144', '732 block h', 'client'),
  (v_salon_id, 'Khethiwe Khethiwe', 'khethi.naomi@gmail.com', '+27836936515', '334 Block L', 'client'),
  (v_salon_id, 'Refilwe Makua', 'kutwanemakua@gmail.com', '0721878267', 'TUT', 'client'),
  (v_salon_id, 'lungile Nkabinde', 'lungilenkabi03@gmail.com', '0727053879', 'TUT', 'client'),
  (v_salon_id, 'Thandolwethu', 'lungilethandolwethu9@gmail.com', '0762951095', '6837 Bontle Street', 'client'),
  (v_salon_id, 'Buhle Mabena', 'mabenabuhle17@gmail.com', '0769317937', 'Duduzani street block Dd soshanguve', 'client'),
  (v_salon_id, 'Palesa', 'magagulapalesa20@gmail.com', '0648431190', '1076 Block MM', 'client'),
  (v_salon_id, 'Ditebogo Mashia Gwagwa', 'mashiagwagwa13@gmail.com', '0820727761', '2047 block h Soshanguve o152', 'client'),
  (v_salon_id, 'Tinyiko Mdluli', 'mdlulitinyiko7@gmail.com', '0647026719', '', 'client'),
  (v_salon_id, 'khanyisa madaure', 'mkhanyisa@gmail.com', '+27793544710', '972 Block L', 'client'),
  (v_salon_id, 'Noluthando Mndebele', 'mndebelenoluthando07@gmail.com', '0791187560', 'Soshanguve Block K 189', 'client'),
  (v_salon_id, 'constance', 'mojelaconny5@gmail.com', '0761834308', '2670 phase8', 'client'),
  (v_salon_id, 'Naledi Malele', 'naledijenica551@gmail.com', '0664202529', '', 'client'),
  (v_salon_id, 'nokuthula', 'nokuthulazandy21@gmail.com', '0697816866', 'Block L', 'client'),
  (v_salon_id, 'Nomalungelo', 'NOMALUNGELOLANGA@GMAIL.COM', '0797627293', '797 block L Soshanguve Aubrey mathlala street 0152', 'client'),
  (v_salon_id, 'Nomthadazo', 'nomthandazomorobe@gmail.com', '0769055224', '18230 Soshanguve south', 'client'),
  (v_salon_id, 'NONJABULO SHEREES THABETHE', 'nsherees@gmail.com', '0679029583', 'Mobopane section D near zungu', 'client'),
  (v_salon_id, 'Olebogeng', 'olebogengfmadiba@icloud.com', '+27664223408', '543 Block Uu Soshanguve', 'client'),
  (v_salon_id, 'Oratilwe', 'oratilwemogoba05@gmail.com', '0716724800', '839 block L soshanguve', 'client'),
  (v_salon_id, 'Phionah Montwedi', 'Phionah.moshibudi@gmail.com', '0695616919', '133 block s soshanguve nyathi street 0152', 'client'),
  (v_salon_id, 'PraiseGod Francina', 'praisegodnjosi@gmail.com', '0646868184', '', 'client'),
  (v_salon_id, 'nkateko Rasemana', 'rasemanankateko@gmail.com', '+27715849487', 'Soshanguve block L Pretoria', 'client'),
  (v_salon_id, 'Vivian', 'refbooysen@gmail.com', '072 937 0177', '435 Block L Soshanguve', 'client'),
  (v_salon_id, 'rethabile', 'rethakhoza@icloud.com', '0712615340', '', 'client'),
  (v_salon_id, 'Reitumetse', 'rmatsoha@gmail.com', 'Matsoha', '', 'client'),
  (v_salon_id, 'Rorisang Malahlela', 'rorisangroro90@gmail.com', '+27813656918', '131 Block Bb Soshanguve Atamelang street', 'client'),
  (v_salon_id, 'sisipho', 'sisiphomakade@gmail.com', '0632515828', '6645 joel gumede street', 'client'),
  (v_salon_id, 'thandazile', 'thandazilesilinda40@gmail.com', '0764816919', '147 Johnston street', 'client'),
  (v_salon_id, 'Nhlalala Tibane', 'Tibanenhlalala@gmail.com', '0765274139', 'Telkom residence soshanguve block H', 'client'),
  (v_salon_id, 'tshegofatso', 'tshegofatsonozipho@gmail.com', '+27681728486', '', 'client'),
  (v_salon_id, 'Tshepiso', 'Tshepisokmanamela@gmail.com', '0760984210', 'Tshepisokmanamela@gmail.com', 'client'),
  (v_salon_id, 'Basetsana', 'bocaybasetsana@gmail.com', 'Bokako', '421 Block H Soshanguve', 'client'),
  (v_salon_id, 'Katlego Mashala', 'faithlivhuwani90@gmail.com', '0685105504', '677 E Matsemela block F west', 'client'),
  (v_salon_id, 'Letlhogonolo', 'Letlhogonolomodiba829@gmail.com', '0812062744', '1047block k', 'client'),
  (v_salon_id, 'mirriam Pontsho', 'mtswai57@gmail.com', '+27736182681', '6637 Ucwethe Street, Soshanguve, Gauteng, 0152', 'client'),
  (v_salon_id, 'Nozipho', 'noziphonozzy6@gmail.com', '722074986', '07 Aubrey Matlala Street, Block L, Pretoria, Gauteng, 0152', 'client'),
  (v_salon_id, 'nthabiseng tshukudu', 'nthabisengtshukudu@gmail.com', '+27734579982', '8666 phase 5 Morula view', 'client'),
  (v_salon_id, 'Julia Matjila', 'thatojulia2@gmail.com', '+27 74 011 9975', '29889/17 EXT 7, Soshanguve South, Pretoria, Gauteng', 'client'),
  (v_salon_id, 'Thando', 'valenciamotshele@gmail.com', '0670606267', '7740 bell pepper crescent orchards', 'client')
  ON CONFLICT DO NOTHING;
END $$;
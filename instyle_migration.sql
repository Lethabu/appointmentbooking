DO $$
DECLARE
  v_salon_id UUID := 'ccb12b4d-ade6-467d-a614-7c9d198ddc70';
BEGIN
  -- Insert the salon first
  INSERT INTO salons (id, name, subdomain, owner_id, plan)
  VALUES (v_salon_id, 'InStyle Hair Boutique', 'instylehairboutique', '00000000-0000-0000-0000-000000000000', 'elite') -- Replace with a valid owner_id if available, or a placeholder
  ON CONFLICT (id) DO NOTHING; -- Prevents error if salon already exists

  INSERT INTO profiles (salon_id, full_name, email, phone, address, role) VALUES (v_salon_id, 'Olerato ', 'aobakwe.modise@icloud.com', 'Modise', '4582 Block B Mabopane 
Pretoria
0190', 'client');
  INSERT INTO profiles (salon_id, full_name, email, phone, address, role) VALUES (v_salon_id, 'Lethabo', 'booysenlethabo@icloud.com', '0691524569', 'Soshanguve, block L', 'client');
  INSERT INTO profiles (salon_id, full_name, email, phone, address, role) VALUES (v_salon_id, 'Kopano Selepe ', 'faithselepe333@gmail.com', '081 546 8520 ', '827 Marothodi streets block k soshanguve ', 'client');
  INSERT INTO profiles (salon_id, full_name, email, phone, address, role) VALUES (v_salon_id, 'motlalethabo Gloria ', 'hlomotlalethabo@gmail.com', '0660178779', '906 dithabaneng street K Soshanguve 0152', 'client');
  INSERT INTO profiles (salon_id, full_name, email, phone, address, role) VALUES (v_salon_id, 'sinethmba Queen maphanga ', 'indoniswati@gmail.com', '+27764492790', '890 block BB Soshanguve ', 'client');
  INSERT INTO profiles (salon_id, full_name, email, phone, address, role) VALUES (v_salon_id, 'Oratilwe Kamogelo', 'kamogelooratilwe03@gmail.com', '0614144983', '8022 Nakedi Street 
Mabopane', 'client');
  INSERT INTO profiles (salon_id, full_name, email, phone, address, role) VALUES (v_salon_id, 'Karabelo Motaung', 'karabelolbmotaung02@gmail.com', '+27665972425', '6609 Dithabaneng soshanguve block K', 'client');
  INSERT INTO profiles (salon_id, full_name, email, phone, address, role) VALUES (v_salon_id, 'catherine', 'katarinacatherine11@gmail.com', '+27608172144', '732 block h', 'client');
  INSERT INTO profiles (salon_id, full_name, email, phone, address, role) VALUES (v_salon_id, 'Khethiwe Khethiwe', 'khethi.naomi@gmail.com', '+27836936515', '334 Block L', 'client');
  INSERT INTO profiles (salon_id, full_name, email, phone, address, role) VALUES (v_salon_id, 'Refilwe Makua ', 'kutwanemakua@gmail.com', '0721878267', 'TUT', 'client');
  INSERT INTO profiles (salon_id, full_name, email, phone, address, role) VALUES (v_salon_id, 'lungile Nkabinde ', 'lungilenkabi03@gmail.com', '0727053879', 'TUT', 'client');
  INSERT INTO profiles (salon_id, full_name, email, phone, address, role) VALUES (v_salon_id, 'Thandolwethu', 'lungilethandolwethu9@gmail.com', '0762951095', '6837 Bontle Street ', 'client');
  INSERT INTO profiles (salon_id, full_name, email, phone, address, role) VALUES (v_salon_id, 'Buhle Mabena ', 'mabenabuhle17@gmail.com', '0769317937 ', 'Duduzani street block Dd soshanguve ', 'client');
  INSERT INTO profiles (salon_id, full_name, email, phone, address, role) VALUES (v_salon_id, 'Palesa', 'magagulapalesa20@gmail.com', '0648431190', '1076 Block MM', 'client');
  INSERT INTO profiles (salon_id, full_name, email, phone, address, role) VALUES (v_salon_id, 'Ditebogo Mashia Gwagwa', 'mashiagwagwa13@gmail.com', '0820727761', '2047 block h Soshanguve o152', 'client');
  INSERT INTO profiles (salon_id, full_name, email, phone, address, role) VALUES (v_salon_id, 'Tinyiko Mdluli', 'mdlulitinyiko7@gmail.com', '0647026719', '', 'client');
  INSERT INTO profiles (salon_id, full_name, email, phone, address, role) VALUES (v_salon_id, 'khanyisa madaure', 'mkhanyisa@gmail.com', '+27793544710', '972 Block L', 'client');
  INSERT INTO profiles (salon_id, full_name, email, phone, address, role) VALUES (v_salon_id, 'Noluthando Mndebele ', 'mndebelenoluthando07@gmail.com', '0791187560', 'Soshanguve
Block K 189', 'client');
  INSERT INTO profiles (salon_id, full_name, email, phone, address, role) VALUES (v_salon_id, 'constance ', 'mojelaconny5@gmail.com', '0761834308', '2670 phase8', 'client');
  INSERT INTO profiles (salon_id, full_name, email, phone, address, role) VALUES (v_salon_id, 'Naledi Malele', 'naledijenica551@gmail.com', '0664202529', '', 'client');
  INSERT INTO profiles (salon_id, full_name, email, phone, address, role) VALUES (v_salon_id, 'nokuthula ', 'nokuthulazandy21@gmail.com', '0697816866', 'Block L', 'client');
  INSERT INTO profiles (salon_id, full_name, email, phone, address, role) VALUES (v_salon_id, 'Nomalungelo', 'NOMALUNGELOLANGA@GMAIL.COM', '0797627293', '797 block L 
Soshanguve 
Aubrey mathlala street 
0152 ', 'client');
  INSERT INTO profiles (salon_id, full_name, email, phone, address, role) VALUES (v_salon_id, 'Nomthadazo ', 'nomthandazomorobe@gmail.com', '0769055224', '18230 Soshanguve south ', 'client');
  INSERT INTO profiles (salon_id, full_name, email, phone, address, role) VALUES (v_salon_id, 'NONJABULO SHEREES THABETHE ', 'nsherees@gmail.com', '0679029583', 'Mobopane section D near zungu', 'client');
  INSERT INTO profiles (salon_id, full_name, email, phone, address, role) VALUES (v_salon_id, 'Olebogeng', 'olebogengfmadiba@icloud.com', '+27664223408', '543 Block Uu Soshanguve ', 'client');
  INSERT INTO profiles (salon_id, full_name, email, phone, address, role) VALUES (v_salon_id, 'Oratilwe ', 'oratilwemogoba05@gmail.com', '0716724800', '839 block L soshanguve', 'client');
  INSERT INTO profiles (salon_id, full_name, email, phone, address, role) VALUES (v_salon_id, 'Phionah Montwedi ', 'Phionah.moshibudi@gmail.com', '0695616919 ', '133 block s soshanguve nyathi street 0152
', 'client');
  INSERT INTO profiles (salon_id, full_name, email, phone, address, role) VALUES (v_salon_id, 'PraiseGod Francina', 'praisegodnjosi@gmail.com', '0646868184', '', 'client');
  INSERT INTO profiles (salon_id, full_name, email, phone, address, role) VALUES (v_salon_id, 'nkateko Rasemana', 'rasemanankateko@gmail.com', '+27715849487', 'Soshanguve block L
Pretoria', 'client');
  INSERT INTO profiles (salon_id, full_name, email, phone, address, role) VALUES (v_salon_id, 'Vivian ', 'refbooysen@gmail.com', '072 937 0177 ', '435 Block L Soshanguve ', 'client');
  INSERT INTO profiles (salon_id, full_name, email, phone, address, role) VALUES (v_salon_id, 'rethabile', 'rethakhoza@icloud.com', '0712615340', '', 'client');
  INSERT INTO profiles (salon_id, full_name, email, phone, address, role) VALUES (v_salon_id, 'Reitumetse ', 'rmatsoha@gmail.com', 'Matsoha ', '', 'client');
  INSERT INTO profiles (salon_id, full_name, email, phone, address, role) VALUES (v_salon_id, 'Rorisang Malahlela ', 'rorisangroro90@gmail.com', '+27813656918', '131 Block Bb
Soshanguve 
Atamelang street', 'client');
  INSERT INTO profiles (salon_id, full_name, email, phone, address, role) VALUES (v_salon_id, 'sisipho', 'sisiphomakade@gmail.com', '0632515828', '6645 joel gumede street', 'client');
  INSERT INTO profiles (salon_id, full_name, email, phone, address, role) VALUES (v_salon_id, 'thandazile', 'thandazilesilinda40@gmail.com', '0764816919', '147 Johnston street', 'client');
  INSERT INTO profiles (salon_id, full_name, email, phone, address, role) VALUES (v_salon_id, ' Nhlalala Tibane ', 'Tibanenhlalala@gmail.com', '0765274139', 'Telkom residence soshanguve block H ', 'client');
  INSERT INTO profiles (salon_id, full_name, email, phone, address, role) VALUES (v_salon_id, 'tshegofatso', 'tshegofatsonozipho@gmail.com', '+27681728486', '', 'client');
  INSERT INTO profiles (salon_id, full_name, email, phone, address, role) VALUES (v_salon_id, 'Tshepiso ', 'Tshepisokmanamela@gmail.com', '0760984210 ', 'Tshepisokmanamela@gmail.com ', 'client');
  INSERT INTO profiles (salon_id, full_name, email, phone, address, role) VALUES (v_salon_id, 'Basetsana', 'bocaybasetsana@gmail.com', 'Bokako', '421 Block H Soshanguve ', 'client');
  INSERT INTO profiles (salon_id, full_name, email, phone, address, role) VALUES (v_salon_id, 'Katlego Mashala', 'faithlivhuwani90@gmail.com', '0685105504', '677 E Matsemela block F west', 'client');
  INSERT INTO profiles (salon_id, full_name, email, phone, address, role) VALUES (v_salon_id, 'Letlhogonolo ', 'Letlhogonolomodiba829@gmail.com', '0812062744', '1047block k', 'client');
  INSERT INTO profiles (salon_id, full_name, email, phone, address, role) VALUES (v_salon_id, 'mirriam Pontsho', 'mtswai57@gmail.com', '+27736182681', '6637 Ucwethe Street, Soshanguve, Gauteng, 0152', 'client');
  INSERT INTO profiles (salon_id, full_name, email, phone, address, role) VALUES (v_salon_id, 'Nozipho', 'noziphonozzy6@gmail.com', '722074986', '07 Aubrey Matlala Street, Block L, Pretoria, Gauteng, 0152', 'client');
  INSERT INTO profiles (salon_id, full_name, email, phone, address, role) VALUES (v_salon_id, 'nthabiseng tshukudu', 'nthabisengtshukudu@gmail.com', '+27734579982', '8666 phase 5
Morula view', 'client');
  INSERT INTO profiles (salon_id, full_name, email, phone, address, role) VALUES (v_salon_id, 'Julia Matjila', 'thatojulia2@gmail.com', '+27 74 011 9975', '29889/17 EXT 7, Soshanguve South, Pretoria, Gauteng', 'client');
  INSERT INTO profiles (salon_id, full_name, email, phone, address, role) VALUES (v_salon_id, 'Thando', 'valenciamotshele@gmail.com', '0670606267', '7740 bell pepper crescent orchards', 'client');
END $$;

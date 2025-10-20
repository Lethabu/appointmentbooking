import csv
import xml.etree.ElementTree as ET

def parse_xml(file_path):
    tree = ET.parse(file_path)
    root = tree.getroot()
    clients = []
    for user in root.findall('user'):
        email = user.find('login_name')
        full_name = user.find('full_name')
        phone = user.find('mobile')
        address = user.find('address')
        clients.append({
            'email': email.text if email is not None else '',
            'full_name': full_name.text if full_name is not None else '',
            'phone': phone.text if phone is not None else '',
            'address': address.text if address is not None else '',
        })
    return clients

def parse_csv(file_path):
    clients = []
    with open(file_path, 'r') as f:
        reader = csv.DictReader(f)
        for row in reader:
            clients.append({
                'email': row['Login name'],
                'full_name': row['Full name'],
                'phone': row['Mobile'],
                'address': row['Address'],
            })
    return clients

def generate_sql(clients, salon_id):
    sql = f"DO $$\nDECLARE\n  v_salon_id UUID := '{salon_id}';\nBEGIN\n"
    for client in clients.values():
        full_name = client.get('full_name', '').replace("'", "''")
        email = client.get('email', '').replace("'", "''")
        phone = client.get('phone', '').replace("'", "''")
        address = client.get('address', '').replace("'", "''")
        sql += f"  INSERT INTO profiles (salon_id, full_name, email, phone, address, role) VALUES (v_salon_id, '{full_name}', '{email}', '{phone}', '{address}', 'client');\n"
    sql += "END $$;"
    return sql

if __name__ == '__main__':
    xml_clients = parse_xml('c:/Users/Adrin/Documents/Instyle/client base.xml')
    csv_clients = parse_csv('c:/Users/Adrin/Documents/Instyle/InStyle_Hair_Boutique.csv')

    clients = {}
    for client in xml_clients + csv_clients:
        email = client.get('email')
        if email not in clients:
            clients[email] = client
        else:
            for key, value in client.items():
                if not clients[email].get(key):
                    clients[email][key] = value

    salon_id = 'ccb12b4d-ade6-467d-a614-7c9d198ddc70'
    sql = generate_sql(clients, salon_id)

    print(sql)

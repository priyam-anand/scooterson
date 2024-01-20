#!/bin/bash

# Specify the output directory
output_dir="keys"

# Create the output directory if it doesn't exist
mkdir -p "$output_dir"

# Define file paths
private_key="${output_dir}/client-key.pem"
csr_file="${output_dir}/client.csr"
cert_file="${output_dir}/client-cert.pem"

if [ ! -f "$private_key" ] || [ ! -f "$csr_file" ] || [ ! -f "$cert_file" ]; then
    echo "SSL certificate files do not exist. Building them now..."
    
    openssl genrsa -out "$private_key" 2048
    openssl req -new -key "$private_key" -out "$csr_file"
    openssl x509 -req -in "$csr_file" -signkey "$private_key" -out "$cert_file"
    
    echo "SSL certificate files generated successfully."
else
    echo "SSL certificate files already exist."
fi

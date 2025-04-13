interface ValidateTokenResponseDTO {
    valid: boolean;
    expiration: string;
    user_id: string;
}

export default ValidateTokenResponseDTO;

// Data Transfer Objects (DTOs) for validating and transforming incoming request data.
// Misc DTOs for various operations.

// DTO for Health Check Response
export class HealthCheckResponseDto {
	status!: string;
	uptime!: string;
	timestamp!: string; // ISO 8601 format
}

// DTO for Log File Response
export class LogFileResponseDto {
	log_file!: string;
	content!: string;
}

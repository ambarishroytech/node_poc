// Represents the RefGroupTypes table.
export class RefGroupType {
	ref_group_type_id!: number; // Primary key
	ref_group_type_name!: string; // Unique and not null
	is_restricted!: boolean; // Not null
}

module.exports = grammar({
  	name: 'norg',

	externals: $ => [
    	$._,

    	$.paragraph_segment,
    	$.escape_sequence_prefix,

        $.heading1_prefix,
        $.heading2_prefix,
        $.heading3_prefix,
        $.heading4_prefix,
        $.heading5_prefix,
        $.heading6_prefix,

        $.quote_prefix,
        $.unordered_list_prefix,
        $.marker_prefix,
        $.todo_item_prefix,
        $.unordered_link_prefix,

        $.paragraph_delimiter,

        $.link_begin,
        $.link_end_generic,
        $.link_end_url,
        $.link_end_heading1_reference,
        $.link_end_heading2_reference,
        $.link_end_heading3_reference,
        $.link_end_heading4_reference,
        $.link_end_heading5_reference,
        $.link_end_heading6_reference,
        $.link_end_marker_reference,
        $.link_end_drawer_reference,
  	],

  	rules: {
        document: $ => repeat(
            choice(
                prec(1,
                    choice(
                        $._standalone_break,
                        $._heading,
                        $._detached_modifier,
                        // Markers are separate from detached modifiers because they are the a l p h a modifier (consumes all elements)
                        $.marker,
                    )
                ),

                $.paragraph,
                $.paragraph_delimiter,
            )
        ),

        // Any regular text
        paragraph: $ =>
            prec.right(0,
                repeat1(
                    choice(
                        alias(
                            $.paragraph_segment,
                            "_segment",
                        ),

                        $.link,
                        $.escape_sequence,
                    )
                )
            ),

        // Well, any character
        any_char: $ =>
            token.immediate(/./),

        // A backslash followed by the escape token (e.g. \*)
        escape_sequence: $ =>
            seq(
                $.escape_sequence_prefix,

                field(
                    "token",
                    $.any_char,
                )
            ),

        link: $ =>
            seq(
                $.link_begin,
                optional(
                    field(
                        "location",
                        choice(
                            $.link_end_generic,
                            $.link_end_url,
                            $.link_end_heading1_reference,
                            $.link_end_heading2_reference,
                            $.link_end_heading3_reference,
                            $.link_end_heading4_reference,
                            $.link_end_heading5_reference,
                            $.link_end_heading6_reference,
                            $.link_end_marker_reference,
                            $.link_end_drawer_reference,
                        )
                    )
                )
            ),

        unordered_link: $ =>
            seq(
                alias(
                    $.unordered_link_prefix,
                    "_prefix"
                ),

                field(
                    "location",
                    $.link
                )
            ),

        // A first-level heading:
        // * Example
        heading1: $ =>
            prec.right(0,
                seq(
                    $.heading1_prefix,

                    field(
                        "title",
                        $.paragraph_segment,
                    ),

                    field(
                        "content",

                        repeat(
                            choice(
                                $.paragraph,

                                $._standalone_break,
                                $._detached_modifier,

                                $.heading2,
                                $.heading3,
                                $.heading4,
                                $.heading5,
                                $.heading6,
                            )
                        )
                    )
                )
            ),

        // A second-level heading:
        // ** Example
        heading2: $ =>
            prec.right(0,
                seq(
                    $.heading2_prefix,

                    field(
                        "title",
                        $.paragraph_segment,
                    ),

                    field(
                        "content",

                        repeat(
                            choice(
                                $.paragraph,

                                $._standalone_break,
                                $._detached_modifier,

                                $.heading3,
                                $.heading4,
                                $.heading5,
                                $.heading6,
                            )
                        )
                    )
                )
            ),

        // A third-level heading:
        // *** Example
        heading3: $ =>
            prec.right(0,
                seq(
                    $.heading3_prefix,

                    field(
                        "title",
                        $.paragraph_segment,
                    ),

                    field(
                        "content",

                        repeat(
                            choice(
                                $.paragraph,

                                $._standalone_break,
                                $._detached_modifier,

                                $.heading4,
                                $.heading5,
                                $.heading6,
                            )
                        )
                    )
                )
            ),

        // A fourth-level heading:
        // **** Example
        heading4: $ =>
            prec.right(0,
                seq(
                    $.heading4_prefix,

                    field(
                        "title",
                        $.paragraph_segment,
                    ),

                    field(
                        "content",

                        repeat(
                            choice(
                                $.paragraph,

                                $._standalone_break,
                                $._detached_modifier,

                                $.heading5,
                                $.heading6,
                            )
                        )
                    )
                )
            ),

        // A fifth-level heading:
        // ***** Example
        heading5: $ =>
            prec.right(0,
                seq(
                    $.heading5_prefix,

                    field(
                        "title",
                        $.paragraph_segment,
                    ),

                    field(
                        "content",

                        repeat(
                            choice(
                                $.paragraph,

                                $._standalone_break,
                                $._detached_modifier,

                                $.heading6,
                            )
                        )
                    )
                )
            ),

        // A sixth-level heading:
        // ******* Example
        heading6: $ =>
            prec.right(0,
                seq(
                    $.heading6_prefix,

                    field(
                        "title",
                        $.paragraph_segment,
                    ),

                    field(
                        "content",

                        repeat(
                            choice(
                                $.paragraph,

                                $._standalone_break,
                                $._detached_modifier,
                            )
                        )
                    )
                )
            ),

        // A quote:
        // > That's what she said
        quote: $ =>
            seq(
                $.quote_prefix,

                field(
                    "content",
                    $.paragraph_segment,
                )
            ),

        // TODO: complete docs tomorrow
        unordered_list: $ =>
            seq(
                $.unordered_list_prefix,

                field(
                    "content",
                    $.paragraph,
                )
            ),

        marker: $ =>
            prec.right(0,
                seq(
                    $.marker_prefix,

                    field(
                        "name",
                        $.paragraph_segment
                    ),

                    field(
                        "subtext",
                        repeat(
                            choice(
                                $.paragraph,
                                $.paragraph_delimiter,
                                $._heading,
                                $._detached_modifier,
                                $._standalone_break,
                            ),
                        ),
                    )
                )
            ),

        // --------------------------------------------------
        todo_item_undone: $ =>
            token.immediate(/\s+/),

        todo_item_pending: $ =>
            token("*"),

        todo_item_done: $ =>
            token("x"),

        todo_item_suffix: $ =>
            token.immediate(']'),

        // THOUGHTS: If a user misspells a char here it becomes an error rather than falling back
        // to becoming a paragraph - is this the behaviour we want?
        todo_item: $ =>
            seq(
                $.unordered_list_prefix,

                alias(
                    $.todo_item_prefix,
                    "_prefix",
                ),

                choice(
                    field(
                        "undone_token",
                        $.todo_item_undone,
                    ),
                    field(
                        "pending_token",
                        $.todo_item_pending,
                    ),
                    field(
                        "done_token",
                        $.todo_item_done,
                    )
                ),

                alias(
                    $.todo_item_suffix,
                    "_suffix",
                ),

                token(/\s+/),

                field(
                    "content",
                    $.paragraph
                )
            ),

        // --------------------------------------------------

        _standalone_break: $ =>
            token(/\n/),

        _heading: $ =>
            choice(
                $.heading1,
                $.heading2,
                $.heading3,
                $.heading4,
                $.heading5,
                $.heading6,
            ),

        // A list of detached modifiers (excluding headings, those belong in the $._heading group)
        _detached_modifier: $ =>
            choice(
                $.quote,
                $.unordered_link,
                $.unordered_list,
                $.todo_item,
            ),

    	/*
		"unordered_link_list_prefix",
		"unordered_link_list",
		"tag",
		"tag_content",
		"tag_name",
		"tag_parameters",
		"tag_end",
		"carryover_tag",
		"drawer",
		"drawer_content",
		"escape_sequence", ??
		*/
  	}
});

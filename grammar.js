module.exports = grammar({
    name: 'norg',

    externals: $ => [
        $._,

        $.paragraph_segment,
        $._standalone_break,
        $.escape_sequence_prefix,

        $.heading1_prefix,
        $.heading2_prefix,
        $.heading3_prefix,
        $.heading4_prefix,
        $.heading5_prefix,
        $.heading6_prefix,

        $.quote1_prefix,
        $.quote2_prefix,
        $.quote3_prefix,
        $.quote4_prefix,
        $.quote5_prefix,
        $.quote6_prefix,

        $.unordered_list1_prefix,
        $.unordered_list2_prefix,
        $.unordered_list3_prefix,
        $.unordered_list4_prefix,
        $.unordered_list5_prefix,
        $.unordered_list6_prefix,

        $.marker_prefix,

        $.drawer_prefix,
        $.drawer_suffix,

        $.todo_item_prefix,

		$.insertion_prefix,

        $.unordered_link1_prefix,
        $.unordered_link2_prefix,
        $.unordered_link3_prefix,
        $.unordered_link4_prefix,
        $.unordered_link5_prefix,
        $.unordered_link6_prefix,

        $.strong_paragraph_delimiter,
        $.weak_paragraph_delimiter,

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

                $._paragraph,
                $.strong_paragraph_delimiter,
            )
        ),

		_paragraph: $ =>
			prec.right(0,
				seq(
					$.paragraph,

					optional(
						$._standalone_break,
					)
				)
			),

        // Any regular text
        paragraph: $ =>
            prec.right(0,
                seq(
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
            prec.right(0,
                repeat1(
                    choice(
                        $.unordered_link1,
                        $.unordered_link2,
                        $.unordered_link3,
                        $.unordered_link4,
                        $.unordered_link5,
                        $.unordered_link6,
                    )
                )
            ),

        unordered_link1: $ =>
            prec.right(0,
                seq(
                    alias(
                        $.unordered_link1_prefix,
                        "_prefix"
                    ),

                    field(
                        "location",
                        $.link
                    ),

                    optional(
                        $._standalone_break
                    ),

                    repeat(
                        choice(
                            $.unordered_link2,
                            $.unordered_link3,
                            $.unordered_link4,
                            $.unordered_link5,
                            $.unordered_link6,
                        )
                    )
                )
            ),

        unordered_link2: $ =>
            prec.right(0,
                seq(
                    alias(
                        $.unordered_link2_prefix,
                        "_prefix"
                    ),

                    field(
                        "location",
                        $.link
                    ),

                    optional(
                        $._standalone_break
                    ),

                    repeat(
                        choice(
                            $.unordered_link3,
                            $.unordered_link4,
                            $.unordered_link5,
                            $.unordered_link6,
                        )
                    )
                )
            ),

        unordered_link3: $ =>
            prec.right(0,
                seq(
                    alias(
                        $.unordered_link3_prefix,
                        "_prefix"
                    ),

                    field(
                        "location",
                        $.link
                    ),

                    optional(
                        $._standalone_break
                    ),

                    repeat(
                        choice(
                            $.unordered_link4,
                            $.unordered_link5,
                            $.unordered_link6,
                        )
                    )
                )
            ),

        unordered_link4: $ =>
            prec.right(0,
                seq(
                    alias(
                        $.unordered_link4_prefix,
                        "_prefix"
                    ),

                    field(
                        "location",
                        $.link
                    ),

                    optional(
                        $._standalone_break
                    ),

                    repeat(
                        choice(
                            $.unordered_link5,
                            $.unordered_link6,
                        )
                    )
                )
            ),

        unordered_link5: $ =>
            prec.right(0,
                seq(
                    alias(
                        $.unordered_link5_prefix,
                        "_prefix"
                    ),

                    field(
                        "location",
                        $.link
                    ),

                    optional(
                        $._standalone_break
                    ),

                    repeat(
                        $.unordered_link6,
                    )
                )
            ),

        unordered_link6: $ =>
            prec.right(0,
                seq(
                    alias(
                        $.unordered_link6_prefix,
                        "_prefix"
                    ),

                    field(
                        "location",
                        $.link
                    ),

                    optional(
                        $._standalone_break
                    ),
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
                                $._paragraph,

                                $._standalone_break,
                                $._detached_modifier,

                                $.heading2,
                                $.heading3,
                                $.heading4,
                                $.heading5,
                                $.heading6,
                            )
                        )
                    ),

                    optional(
                        $.weak_paragraph_delimiter,
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
                                $._paragraph,

                                $._standalone_break,
                                $._detached_modifier,

                                $.heading3,
                                $.heading4,
                                $.heading5,
                                $.heading6,
                            )
                        )
                    ),

                    optional(
                        $.weak_paragraph_delimiter,
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
                                $._paragraph,

                                $._standalone_break,
                                $._detached_modifier,

                                $.heading4,
                                $.heading5,
                                $.heading6,
                            )
                        )
                    ),

                    optional(
                        $.weak_paragraph_delimiter,
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
                                $._paragraph,

                                $._standalone_break,
                                $._detached_modifier,

                                $.heading5,
                                $.heading6,
                            )
                        )
                    ),

                    optional(
                        $.weak_paragraph_delimiter,
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
                                $._paragraph,

                                $._standalone_break,
                                $._detached_modifier,

                                $.heading6,
                            )
                        )
                    ),

                    optional(
                        $.weak_paragraph_delimiter,
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
                                $._paragraph,

                                $._standalone_break,
                                $._detached_modifier,
                            )
                        )
                    ),

                    optional(
                        $.weak_paragraph_delimiter,
                    )
                )
            ),

        // A quote:
        // > That's what she said
        quote: $ =>
            prec.right(0,
                repeat1(
                    choice(
                        $.quote1,
                        $.quote2,
                        $.quote3,
                        $.quote4,
                        $.quote5,
                        $.quote6
                    )
                )
            ),

        quote1: $ =>
            prec.right(0,
                seq(
                    $.quote1_prefix,

                    field(
                        "content",
                        $.paragraph_segment,
                    ),

                    repeat(
                        choice(
                            $.quote2,
                            $.quote3,
                            $.quote4,
                            $.quote5,
                            $.quote6,
                        ),
                    )
                )
            ),

        quote2: $ =>
            prec.right(0,
                seq(
                    $.quote2_prefix,

                    field(
                        "content",
                        $.paragraph_segment,
                    ),

                    repeat(
                        choice(
                            $.quote3,
                            $.quote4,
                            $.quote5,
                            $.quote6,
                        ),
                    )
                )
            ),

        quote3: $ =>
            prec.right(0,
                seq(
                    $.quote3_prefix,

                    field(
                        "content",
                        $.paragraph_segment,
                    ),

                    repeat(
                        choice(
                            $.quote4,
                            $.quote5,
                            $.quote6,
                        ),
                    )
                )
            ),

        quote4: $ =>
            prec.right(0,
                seq(
                    $.quote4_prefix,

                    field(
                        "content",
                        $.paragraph_segment,
                    ),

                    repeat(
                        choice(
                            $.quote5,
                            $.quote6,
                        ),
                    )
                )
            ),

        quote5: $ =>
            prec.right(0,
                seq(
                    $.quote5_prefix,

                    field(
                        "content",
                        $.paragraph_segment,
                    ),

                    repeat(
                        $.quote6,
                    )
                )
            ),

        quote6: $ =>
            prec.right(0,
                seq(
                    $.quote6_prefix,

                    field(
                        "content",
                        $.paragraph_segment,
                    )
                )
            ),

        // TODO: complete docs tomorrow
        generic_list: $ =>
            prec.right(0,
                repeat1(
                    choice(
                        $.unordered_list1,
                        $.unordered_list2,
                        $.unordered_list3,
                        $.unordered_list4,
                        $.unordered_list5,
                        $.unordered_list6,
                        $.todo_item,
                        $.unordered_link,
                    )
                )
            ),

        unordered_list1: $ =>
            prec.right(0,
                seq(
                    $.unordered_list1_prefix,

                    field(
                        "content",
                        $._paragraph,
                    ),

                    repeat(
                        choice(
                            $.todo_item2,
                            $.todo_item3,
                            $.todo_item4,
                            $.todo_item5,
                            $.todo_item6,

                            $.unordered_list2,
                            $.unordered_list3,
                            $.unordered_list4,
                            $.unordered_list5,
                            $.unordered_list6,
                        )
                    )
                )
            ),

        unordered_list2: $ =>
            prec.right(0,
                seq(
                    $.unordered_list2_prefix,

                    field(
                        "content",
                        $._paragraph,
                    ),

                    repeat(
                        choice(
                            $.todo_item3,
                            $.todo_item4,
                            $.todo_item5,
                            $.todo_item6,

                            $.unordered_list3,
                            $.unordered_list4,
                            $.unordered_list5,
                            $.unordered_list6,
                        )
                    )
                )
            ),

        unordered_list3: $ =>
            prec.right(0,
                seq(
                    $.unordered_list3_prefix,

                    field(
                        "content",
                        $._paragraph,
                    ),

                    repeat(
                        choice(
                            $.todo_item4,
                            $.todo_item5,
                            $.todo_item6,

                            $.unordered_list4,
                            $.unordered_list5,
                            $.unordered_list6,
                        )
                    )
                )
            ),

        unordered_list4: $ =>
            prec.right(0,
                seq(
                    $.unordered_list4_prefix,

                    field(
                        "content",
                        $._paragraph,
                    ),

                    repeat(
                        choice(
                            $.todo_item5,
                            $.todo_item6,

                            $.unordered_list5,
                            $.unordered_list6,
                        )
                    )
                )
            ),

        unordered_list5: $ =>
            prec.right(0,
                seq(
                    $.unordered_list5_prefix,

                    field(
                        "content",
                        $._paragraph,
                    ),

                    repeat(
                        choice(
                            $.todo_item6,
                            $.unordered_list6,
                        )
                    )
                )
            ),

        unordered_list6: $ =>
            prec.right(0,
                seq(
                    $.unordered_list6_prefix,

                    field(
                        "content",
                        $._paragraph,
                    ),
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
                                $._paragraph,
                                $.strong_paragraph_delimiter,
                                $._heading,
                                $._detached_modifier,
                                $._standalone_break,
                            ),
                        ),
                    )
                )
            ),

        drawer: $ =>
            choice(
                seq(
                    alias(
                        $.drawer_prefix,
                        "_title",
                    ),

                    field(
                        "title",
                        $.paragraph_segment,
                    ),

                    field(
                        "content",
                        repeat(
                            choice(
                                $._paragraph,
                                $._standalone_break,
                            )
                        )
                    ),

                    field(
                        "end",
                        $.drawer_suffix
                    ),
                ),

                // Used for preventing annoying errors with incomplete marker definitions
                alias(
                    $.drawer_suffix,
                    "_suffix"
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

        todo_item: $ =>
            prec.right(0,
                repeat1(
                    choice(
                        $.todo_item1,
                        $.todo_item2,
                        $.todo_item3,
                        $.todo_item4,
                        $.todo_item5,
                        $.todo_item6,
                    )
                )
            ),

        todo_item1: $ =>
            prec.right(0,
                seq(
                    $.unordered_list1_prefix,

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
                    ),

                    repeat(
                        choice(
                            $.todo_item2,
                            $.todo_item3,
                            $.todo_item4,
                            $.todo_item5,
                            $.todo_item6,
                        ),
                    ),
                )
            ),

        todo_item2: $ =>
            prec.right(0,
                seq(
                    $.unordered_list2_prefix,

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
                    ),

                    repeat(
                        choice(
                            $.todo_item3,
                            $.todo_item4,
                            $.todo_item5,
                            $.todo_item6,
                        ),
                    ),
                )
            ),

        todo_item3: $ =>
            prec.right(0,
                seq(
                    $.unordered_list3_prefix,

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
                    ),

                    repeat(
                        choice(
                            $.todo_item4,
                            $.todo_item5,
                            $.todo_item6,
                        ),
                    ),
                )
            ),

        todo_item4: $ =>
            prec.right(0,
                seq(
                    $.unordered_list4_prefix,

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
                    ),

                    repeat(
                        choice(
                            $.todo_item5,
                            $.todo_item6,
                        )
                    ),
                )
            ),

        todo_item5: $ =>
            prec.right(0,
                seq(
                    $.unordered_list5_prefix,

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
                    ),

                    repeat(
                        $.todo_item6,
                    ),
                )
            ),

        todo_item6: $ =>
            prec.right(0,
                seq(
                    $.unordered_list6_prefix,

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
                )
            ),

		word: $ =>
			token.immediate(/[a-zA-Z_1-9\-\.]+/),

		insertion: $ =>
			prec.right(0,
				seq(
					alias(
						$.insertion_prefix,
						"_prefix",
					),

					field(
						"item",
						$.word,
					),

					choice(
						seq(
							token.immediate(
								/[\t\v ]+/
							),
							field(
								"parameters",
								$.paragraph_segment
							)
						),

						token.immediate(
							/[\t\v ]+\n/
						),
					),
				)
			),

        // --------------------------------------------------

        // tag: $ => seq(token('@'), )

        // --------------------------------------------------

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
                $.generic_list,
                $.drawer,
                $.insertion,
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

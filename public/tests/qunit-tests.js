QUnit.test( "hello test", function( assert ) {
    assert.ok( 1 == "1", "Passed!" );
});



QUnit.test("can show a problem view", function (assert) {
    learnjs.showView('#problem-1');
    assert.ok($('.view-container .problem-view').length == 1);
});
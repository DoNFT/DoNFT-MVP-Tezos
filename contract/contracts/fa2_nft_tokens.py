import smartpy as sp
FA2 = sp.io.import_script_from_url("https://smartpy.io/templates/fa2_lib.py")

class ExampleFa2Nft(FA2.Fa2Nft, FA2.MintNft):
    pass
    @sp.entry_point
    def mint(self):
        pass

sp.add_compilation_target(
    "fa2_nft_tokens",
    ExampleFa2Nft(
        metadata = sp.utils.metadata_of_url("http://example.com")
    )
)

@sp.add_test(name="FA2 NFT tokens")
def test():
    sc = sp.test_scenario()
    sc.table_of_contents()
    sc.h2("FA2")
    example_fa2_nft = ExampleFa2Nft(
        metadata = sp.utils.metadata_of_url("https://example.com")
    )
    sc += example_fa2_nft

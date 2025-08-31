import json
import re

class Searcher:
    def __init__(self, data_path = "./data.json"):
        self.available_key_list = ["paper_title", "paper_arxiv_id", "repo_url"]

        with open(data_path) as data_file:
            self.data = json.load(data_file)

    """
        按键和关键字搜索, 只允许部分键的搜索
    """
    def search(self, target_value:str, key:str = "paper_title", regex_mode:bool = False, case_sensitive:bool = False) -> list:
        try:
            # 确保键是允许搜索的
            assert key in self.available_key_list, "Key is not available for search."

            if not regex_mode:
                # 处理输入的 target_value, 确保不被当做正则看
                target_value = re.escape(target_value)

            if not case_sensitive:
                # 默认大小写不敏感
                finder = re.compile(target_value, re.I)
            else:
                finder = re.compile(target_value)

            ret_list = []
                
            for item in self.data:
                # 将null跳过
                if not item[key]:
                    continue
                # 找出字符串中所有的关键字
                found_positions_iter = finder.finditer(item[key])
                is_empty = True
                found_positions_list = []
                # 如果有找到, 就会进入循环, 将标志位修改, 并找出所有的匹配起始索引和结束索引
                for match in found_positions_iter:
                    is_empty = False
                    found_positions_list.append(match.span())
                if not is_empty:
                    ret_list.append({"item":item, "detail":found_positions_list})

            return ret_list

        except Exception as e:
            print(f"Search failed: {e}")